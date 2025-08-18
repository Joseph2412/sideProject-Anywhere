import { useQuery } from '@tanstack/react-query';

export function useVenueClosingPeriods() {
  return useQuery({
    queryKey: ['venue-closing-periods'],
    queryFn: async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/venues/closing-periods`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (!res.ok) throw new Error('Errore nel recupero dei periodi di chiusura');
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}
