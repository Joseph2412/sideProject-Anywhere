import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

export interface BookingData {
  id: number;
  venueId: number;
  packageId: number;
  price?: number;
  start: string;
  end: string;
  people: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED' | 'COMPLETED';
  costumerName: string;
  costumerEmail: string;
  createdAt: string;
  updatedAt: string;
  venue?: {
    id: number;
    name: string;
  };
  package?: {
    id: number;
    name: string;
  };
}

export interface BookingsResponse {
  bookings: BookingData[];
  total: number;
  page?: number;
  pageSize?: number;
}

export interface CreateBookingRequest {
  venueId: number;
  packageId: number;
  start: string;
  end: string;
  people: number;
  customerInfo: {
    email: string;
    firstName: string;
    lastName: string;
    phone?: string;
  };
}

/**
 * Hook per recuperare tutte le prenotazioni di un venue
 * @param venueId - ID del venue
 * @param options - Opzioni aggiuntive (status, page, etc.)
 */
export function useVenueBookings(
  venueId: number | undefined,
  options?: {
    status?: string;
    page?: number;
    pageSize?: number;
    startDate?: string;
    endDate?: string;
  }
) {
  return useQuery({
    queryKey: ['venue-bookings', venueId, options],
    queryFn: async (): Promise<BookingsResponse> => {
      if (!venueId) {
        throw new Error('Venue ID richiesto');
      }

      const token = localStorage.getItem('token');
      const params = new URLSearchParams();

      if (options?.status) params.append('status', options.status);
      if (options?.page) params.append('page', options.page.toString());
      if (options?.pageSize) params.append('pageSize', options.pageSize.toString());

      const queryString = params.toString();
      const url = `${process.env.NEXT_PUBLIC_API_HOST}/api/bookings/venues/bookings/${venueId}${queryString ? `?${queryString}` : ''}`;

      const response = await fetch(url, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Errore nel recupero prenotazioni: ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!venueId, // Query abilitata solo se venueId è presente
    staleTime: 2 * 60 * 1000, // 2 minuti - dati più freschi per le prenotazioni
    refetchOnWindowFocus: true,
  });
}

/**
 * Hook per recuperare i dettagli di una singola prenotazione
 * @param bookingId - ID della prenotazione
 */
export function useBookingDetails(bookingId: number | undefined) {
  return useQuery({
    queryKey: ['booking-details', bookingId],
    queryFn: async (): Promise<BookingData> => {
      if (!bookingId) {
        throw new Error('Booking ID richiesto');
      }

      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/bookings/booking/${bookingId}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Errore nel recupero dettagli prenotazione: ${response.statusText}`);
      }

      return response.json();
    },
    enabled: !!bookingId,
    staleTime: 5 * 60 * 1000,
  });
}

/**
 * Hook per creare una nuova prenotazione
 */
export function useCreateBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingData: CreateBookingRequest): Promise<BookingData> => {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/bookings/booking/${bookingData.venueId}`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(bookingData),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Errore nella creazione della prenotazione');
      }

      return response.json();
    },
    onSuccess: data => {
      // Invalida le query delle prenotazioni per ricaricarne i dati
      queryClient.invalidateQueries({
        queryKey: ['venue-bookings', data.venueId],
      });
      queryClient.invalidateQueries({
        queryKey: ['venue-bookings'],
      });
    },
  });
}

/**
 * Hook per eliminare/cancellare una prenotazione
 */
export function useDeleteBooking() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (bookingId: number): Promise<{ message: string }> => {
      const token = localStorage.getItem('token');
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/bookings/booking/${bookingId}`,
        {
          method: 'DELETE',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Errore nella cancellazione della prenotazione');
      }

      return response.json();
    },
    onSuccess: (_, bookingId) => {
      // Invalida tutte le query delle prenotazioni
      queryClient.invalidateQueries({
        queryKey: ['venue-bookings'],
      });
      queryClient.invalidateQueries({
        queryKey: ['booking-details', bookingId],
      });
    },
  });
}

/**
 * Hook per aggiornare lo status di una prenotazione (se implementato nel backend)
 */
export function useUpdateBookingStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (params: {
      bookingId: number;
      status: 'PENDING' | 'CONFIRMED' | 'Cancelled';
    }): Promise<BookingData> => {
      const { bookingId, status } = params;
      const token = localStorage.getItem('token');

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/bookings/booking/${bookingId}/status`,
        {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ status }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Errore nell'aggiornamento dello status");
      }

      return response.json();
    },
    onSuccess: data => {
      // Invalida le query correlate
      queryClient.invalidateQueries({
        queryKey: ['venue-bookings', data.venueId],
      });
      queryClient.invalidateQueries({
        queryKey: ['booking-details', data.id],
      });
    },
  });
}
