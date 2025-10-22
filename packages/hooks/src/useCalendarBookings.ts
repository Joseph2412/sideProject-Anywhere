import { useQuery } from '@tanstack/react-query';
import dayjs, { Dayjs } from 'dayjs';

export interface CalendarBooking {
    id: number;
    start: string;
    end: string;
    status: string;
    costumerName: string;
    costumerEmail: string;
    people: number;
    package?: {
        id: number;
        name: string;
        type: string;
    };
}

/**
* Hook per recuperare le prenotazioni per il calendario
* Filtra per mese/anno specifico per performance
*/
export function useCalendarBookings(venueId: number | undefined, year?: number, month?: number) {
    return useQuery({
        queryKey: ['calendar-bookings', venueId, year, month],
        queryFn: async () => {
            if (!venueId) return [];
            
            const token = localStorage.getItem('token');
            
            // Costruisci i parametri per filtrare per mese
            const params = new URLSearchParams();
            if (year) params.append('year', year.toString());
            if (month !== undefined) params.append('month', month.toString());
            
            const response = await fetch(
                `${process.env.NEXT_PUBLIC_API_HOST}/api/bookings/venues/bookings?${params.toString()}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            
            if (!response.ok) {
                throw new Error('Errore nel caricamento delle prenotazioni');
            }
            
            // ✅ L'endpoint restituisce { bookings: [...] }
            const data = await response.json();
            return data.bookings || [];
        },
        enabled: !!venueId,
        staleTime: 2 * 60 * 1000, // 2 minuti
    });
}

/**
* Trasforma le prenotazioni in eventi calendario raggruppati per data
*/
export function useCalendarEvents(venueId: number | undefined, currentMonth?: Dayjs) {
    const year = currentMonth?.year();
    const month = currentMonth?.month(); // 0-11
    
    const { data: bookings = [], isLoading } = useCalendarBookings(venueId, year, month);
    
    // Raggruppa le prenotazioni per data
    const eventsByDate: Record<string, Array<{
        type: 'success' | 'warning' | 'error' | 'processing';
        content: string;
        booking: CalendarBooking;
    }>> = {};
    
    bookings.forEach((booking) => {
        const startDate = dayjs(booking.start);
        const endDate = dayjs(booking.end);
        
        // Aggiungi eventi per ogni giorno della prenotazione
        let currentDate = startDate.startOf('day');
        while (currentDate.isBefore(endDate) || currentDate.isSame(endDate, 'day')) {
            const dateKey = currentDate.format('YYYY-MM-DD');
            
            if (!eventsByDate[dateKey]) {
                eventsByDate[dateKey] = [];
            }
            
            // Determina il colore in base allo stato
            let type: 'success' | 'warning' | 'error' | 'processing' = 'processing';
            if (booking.status === 'CONFIRMED') type = 'success';
            else if (booking.status === 'PENDING') type = 'warning';
            else if (booking.status === 'CANCELLED') type = 'error';
            
            // Crea il testo dell'evento
            const timeRange = `${startDate.format('HH:mm')}-${endDate.format('HH:mm')}`;
            const content = `${booking.package?.name || 'Prenotazione'} - ${booking.costumerName}`;
            
            eventsByDate[dateKey].push({
                type,
                content: `${timeRange} ${content}`,
                booking,
            });
            
            currentDate = currentDate.add(1, 'day');
        }
    });
    
    return { eventsByDate, isLoading };
}