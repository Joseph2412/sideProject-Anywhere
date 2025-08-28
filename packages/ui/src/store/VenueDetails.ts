// Store dettagli venue: struttura dati e stato globale venue

// Orari di apertura per un singolo giorno
export type OpeningDay = {
  id: number;
  day: string;
  isClosed: boolean;
  periods: string[];
};

// Periodo di chiusura straordinaria
export type ClosingPeriod = {
  id: number;
  start: string;
  end: string;
  isEnable: boolean;
};

/**
 * TYPE DEFINITION: Package
 *
 * Rappresenta un pacchetto/servizio offerto dalla venue.
 * Ogni pacchetto ha caratteristiche specifiche e modalità di prenotazione.
 *
 * STRUTTURA DATI:
 * @param id - Identificativo unico del pacchetto nel database
 * @param name - Nome del pacchetto (es. "Postazione singola", "Sala riunioni")
 * @param description - Descrizione dettagliata opzionale
 * @param squareMetres - Metratura dello spazio in metri quadri
 * @param capacity - Numero massimo di persone che può ospitare
 * @param services - Array servizi inclusi (es. ["WiFi", "Caffè", "Stampante"])
 * @param type - Categoria del pacchetto (es. "desk", "meeting-room", "event-space")
 * @param plans - Piani tariffari disponibili (es. ["hourly", "daily", "weekly"])
 * @param photos - Array URL delle foto del pacchetto
 *
 * ESEMPI:
 * - Postazione: title="Hot Desk", capacity=1, services=["WiFi"], type="desk"
 * - Sala: title="Meeting Room A", capacity=8, services=["Proiettore"], type="meeting-room"
 *
 * BUSINESS LOGIC:
 * - squareMetres: per calcoli densità e conformità normative
 * - capacity: per controllo overbooking
 * - services: per filtri ricerca e prezzi differenziati
 * - plans: per gestione tariffe flessibili
 */
export type Package = {
  id: number; // Primary key database
  name: string; // Nome del pacchetto
  isActive: boolean; // Stato attivo/inattivo del pacchetto
  description?: string; // Descrizione estesa (opzionale)
  squareMetres: number; // Metratura spazio
  capacity: number; // Capacità massima persone
  services: string[]; // Servizi inclusi
  type: string; // Categoria pacchetto
  plans: string[]; // Piani tariffari disponibili
  photos: string[]; // Array URL foto
};

/**
 * TYPE DEFINITION: VenueDetails
 *
 * Struttura principale che contiene tutti i dati di una venue.
 * Rappresenta l'entità centrale del business domain.
 *
 * STRUTTURA DATI:
 * @param id - Identificativo unico della venue nel database
 * @param name - Nome commerciale della venue
 * @param address - Indirizzo fisico completo
 * @param description - Descrizione generale della venue (opzionale)
 * @param services - Servizi generali offerti (WiFi, parcheggio, ecc.)
 * @param avatarURL - URL immagine principale/logo della venue (opzionale)
 * @param photos - Array URL di tutte le foto della venue
 * @param openingDays - Array con orari per ogni giorno della settimana
 * @param closingPeriods - Array con tutti i periodi di chiusura straordinaria
 * @param packages - Array con tutti i pacchetti/servizi offerti
 *
 * RELAZIONI:
 * - Una venue HAS MANY opening days (7 giorni)
 * - Una venue HAS MANY closing periods (N periodi)
 * - Una venue HAS MANY packages (N pacchetti)
 *
 * AGGREGAZIONE DATI:
 * Questa struttura aggrega dati da multiple tabelle database:
 * - venues (dati base)
 * - opening_days (orari)
 * - closing_periods (chiusure)
 * - packages (servizi)
 */
export type VenueDetails = {
  id: number; // Primary key database
  name: string; // Nome commerciale
  address: string; // Indirizzo completo
  description?: string; // Descrizione generale (opzionale)
  services: string[]; // Servizi generali venue
  avatarURL?: string; // Logo/immagine principale (opzionale)
  photos: string[]; // Gallery foto venue
  openingDays: OpeningDay[]; // Orari settimanali (array 7 elementi)
  closingPeriods: ClosingPeriod[]; // Chiusure straordinarie
  packages: Package[]; // Pacchetti/servizi offerti
};
