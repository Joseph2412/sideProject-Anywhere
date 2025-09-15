import { FastifyReply } from 'fastify';

// Map per tenere traccia dei client SSE per ogni venue
// Key: venueId, Value: Set di FastifyReply objects
const clients = new Map<number, Set<FastifyReply>>();

export interface BookingSSEData {
  type: 'created' | 'deleted' | 'heartbeat';
  booking?: any;
  timestamp: string;
  venueId: number;
}

/**
 * Aggiunge un nuovo client SSE per un venue specifico
 * @param venueId - ID del venue
 * @param reply - FastifyReply object
 */
export function addSSEClient(venueId: number, reply: FastifyReply): void {
  // Inizializza il Set per questo venue se non esiste
  if (!clients.has(venueId)) {
    clients.set(venueId, new Set());
  }

  const venueClients = clients.get(venueId)!;
  venueClients.add(reply);

  // Configura headers SSE
  reply.raw.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Authorization, Content-Type',
    'Access-Control-Allow-Methods': 'GET',
  });

  // Invia messaggio di connessione iniziale
  const welcomeMessage: BookingSSEData = {
    type: 'heartbeat',
    timestamp: new Date().toISOString(),
    venueId,
  };

  reply.raw.write(`data: ${JSON.stringify(welcomeMessage)}\n\n`);

  // Heartbeat ogni 30 secondi per mantenere la connessione attiva
  const heartbeatInterval = setInterval(() => {
    try {
      const heartbeat: BookingSSEData = {
        type: 'heartbeat',
        timestamp: new Date().toISOString(),
        venueId,
      };
      reply.raw.write(`data: ${JSON.stringify(heartbeat)}\n\n`);
    } catch (error) {
      // Se l'invio fallisce, rimuovi il client
      clearInterval(heartbeatInterval);
      venueClients.delete(reply);
    }
  }, 30000);

  // Cleanup quando il client si disconnette
  reply.raw.on('close', () => {
    clearInterval(heartbeatInterval);
    venueClients.delete(reply);

    // Se non ci sono più client per questo venue, rimuovi la key
    if (venueClients.size === 0) {
      clients.delete(venueId);
    }

    console.log(
      `📱 SSE Client disconnesso per venue ${venueId}. Clients rimasti: ${venueClients.size}`
    );
  });

  reply.raw.on('error', (error: Error) => {
    console.error(`❌ Errore SSE per venue ${venueId}:`, error);
    clearInterval(heartbeatInterval);
    venueClients.delete(reply);
  });

  console.log(
    `📱 Nuovo SSE Client connesso per venue ${venueId}. Clients totali: ${venueClients.size}`
  );
}

/**
 * Notifica tutti i client SSE di un venue quando c'è un cambiamento nelle prenotazioni
 * @param venueId - ID del venue
 * @param type - Tipo di cambiamento ('created' o 'deleted')
 * @param booking - Dati della prenotazione (opzionale)
 */
export function notifyBookingChange(
  venueId: number,
  type: 'created' | 'deleted',
  booking?: any
): void {
  const venueClients = clients.get(venueId);

  if (!venueClients || venueClients.size === 0) {
    console.log(`📭 Nessun client SSE per venue ${venueId} - notifica ignorata`);
    return;
  }

  const message: BookingSSEData = {
    type,
    booking,
    timestamp: new Date().toISOString(),
    venueId,
  };

  const messageString = JSON.stringify(message);
  const clientsToRemove: FastifyReply[] = [];

  // Invia il messaggio a tutti i client connessi per questo venue
  venueClients.forEach(client => {
    try {
      client.raw.write(`data: ${messageString}\n\n`);
    } catch (error) {
      console.error(`❌ Errore invio SSE a client per venue ${venueId}:`, error);
      clientsToRemove.push(client);
    }
  });

  // Rimuovi i client con errori
  clientsToRemove.forEach(client => {
    venueClients.delete(client);
  });

  console.log(
    `📢 Notifica SSE inviata a ${venueClients.size} client(s) per venue ${venueId}: ${type.toUpperCase()}`
  );
}

/**
 * Ottiene il numero di client connessi per un venue
 * @param venueId - ID del venue
 * @returns Numero di client connessi
 */
export function getConnectedClientsCount(venueId: number): number {
  const venueClients = clients.get(venueId);
  return venueClients ? venueClients.size : 0;
}

/**
 * Ottiene il totale di tutti i client SSE connessi
 * @returns Numero totale di client connessi
 */
export function getTotalConnectedClients(): number {
  let total = 0;
  clients.forEach(venueClients => {
    total += venueClients.size;
  });
  return total;
}

/**
 * Chiude tutte le connessioni SSE (utile per shutdown graceful)
 */
export function closeAllSSEConnections(): void {
  clients.forEach((venueClients, venueId) => {
    venueClients.forEach(client => {
      try {
        client.raw.end();
      } catch (error) {
        console.error(`❌ Errore chiusura SSE per venue ${venueId}:`, error);
      }
    });
  });

  clients.clear();
  console.log('🔌 Tutte le connessioni SSE chiuse');
}
