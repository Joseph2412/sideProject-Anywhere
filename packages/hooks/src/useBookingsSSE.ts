import { useEffect, useRef } from 'react';
import { useQueryClient } from '@tanstack/react-query';

export interface BookingSSEEvent {
  type: 'created' | 'deleted' | 'heartbeat';
  booking?: any;
  timestamp: string;
  venueId: number;
}

/**
 * Hook per gestire la connessione SSE e ricevere aggiornamenti in tempo reale delle prenotazioni
 * @param venueId - ID del venue per cui ricevere notifiche
 * @param options - Opzioni per la configurazione SSE
 */
export function useBookingsSSE(
  venueId: number | undefined,
  options?: {
    enabled?: boolean;
    onBookingCreated?: (booking: any) => void;
    onBookingDeleted?: (booking: any) => void;
    onError?: (error: Error) => void;
    onConnect?: () => void;
    onDisconnect?: () => void;
  }
) {
  const queryClient = useQueryClient();
  const eventSourceRef = useRef<EventSource | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const reconnectAttemptsRef = useRef(0);

  const enabled = options?.enabled !== false; // Default: true
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 1000; // 1 secondo

  const cleanup = () => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  };

  const connect = () => {
    if (!enabled || !venueId) return;

    cleanup(); // Chiudi eventuali connessioni esistenti

    const token = localStorage.getItem('token');
    if (!token) {
      console.warn('⚠️ Token non trovato - SSE non disponibile');
      options?.onError?.(new Error('Token di autenticazione non trovato'));
      return;
    }

    try {
      const url = `${process.env.NEXT_PUBLIC_API_HOST}/api/bookings/venue/${venueId}/events`;

      // Nota: EventSource non supporta headers personalizzati
      // Il token deve essere inviato come query parameter o tramite cookie
      const eventSource = new EventSource(`${url}?token=${encodeURIComponent(token)}`);

      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log(`📡 SSE connesso per venue ${venueId}`);
        reconnectAttemptsRef.current = 0; // Reset counter on successful connection
        options?.onConnect?.();
      };

      eventSource.onmessage = event => {
        try {
          const data: BookingSSEEvent = JSON.parse(event.data);

          console.log(`📨 SSE messaggio ricevuto:`, data);

          switch (data.type) {
            case 'created':
              console.log(`✅ Nuova prenotazione creata:`, data.booking);

              // Invalida e ricarica i dati delle prenotazioni
              queryClient.invalidateQueries({
                queryKey: ['venue-bookings', venueId],
              });

              // Callback personalizzato
              options?.onBookingCreated?.(data.booking);
              break;

            case 'deleted':
              console.log(`❌ Prenotazione cancellata:`, data.booking);

              // Invalida e ricarica i dati delle prenotazioni
              queryClient.invalidateQueries({
                queryKey: ['venue-bookings', venueId],
              });

              // Rimuovi anche i dettagli dalla cache se presenti
              if (data.booking?.id) {
                queryClient.removeQueries({
                  queryKey: ['booking-details', data.booking.id],
                });
              }

              // Callback personalizzato
              options?.onBookingDeleted?.(data.booking);
              break;

            case 'heartbeat':
              // Heartbeat silenzioso - mantiene la connessione attiva
              break;

            default:
              console.warn(`⚠️ Tipo messaggio SSE sconosciuto: ${data.type}`);
          }
        } catch (error) {
          console.error('❌ Errore parsing messaggio SSE:', error);
          options?.onError?.(error as Error);
        }
      };

      eventSource.onerror = event => {
        const error = new Error(`Errore connessione SSE per venue ${venueId}`);
        console.error('❌ Errore SSE:', event);

        options?.onError?.(error);

        // Gestione riconnessione automatica
        if (reconnectAttemptsRef.current < maxReconnectAttempts) {
          const delay = baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current); // Exponential backoff

          console.log(
            `🔄 Tentativo riconnessione SSE ${reconnectAttemptsRef.current + 1}/${maxReconnectAttempts} tra ${delay}ms`
          );

          reconnectTimeoutRef.current = setTimeout(() => {
            reconnectAttemptsRef.current++;
            connect();
          }, delay);
        } else {
          console.error(`💀 Riconnessione SSE fallita dopo ${maxReconnectAttempts} tentativi`);
          options?.onDisconnect?.();
        }
      };
    } catch (error) {
      console.error('❌ Errore creazione EventSource:', error);
      options?.onError?.(error as Error);
    }
  };

  useEffect(() => {
    if (enabled && venueId) {
      connect();
    }

    return cleanup;
  }, [venueId, enabled]); // Riconnetti se cambia venueId o enabled

  // Cleanup on unmount
  useEffect(() => {
    return cleanup;
  }, []);

  return {
    isConnected: eventSourceRef.current?.readyState === EventSource.OPEN,
    reconnectAttempts: reconnectAttemptsRef.current,
    reconnect: () => {
      reconnectAttemptsRef.current = 0;
      connect();
    },
    disconnect: cleanup,
  };
}

/**
 * Hook semplificato per abilitare automaticamente gli aggiornamenti SSE
 * @param venueId - ID del venue
 */
export function useBookingsRealtime(venueId: number | undefined) {
  return useBookingsSSE(venueId, {
    enabled: true,
    onBookingCreated: booking => {
      console.log('🎉 Nuova prenotazione in tempo reale!', booking);
    },
    onBookingDeleted: booking => {
      console.log('🗑️ Prenotazione cancellata in tempo reale!', booking);
    },
    onError: error => {
      console.error('❌ Errore SSE:', error);
    },
  });
}
