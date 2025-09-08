import { useQuery } from '@tanstack/react-query';

export function usePackages(venueId?: number) {
  return useQuery({
    queryKey: ['packages', venueId],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const url = venueId
        ? `${process.env.NEXT_PUBLIC_API_HOST}/api/packages?venueId=${venueId}`
        : `${process.env.NEXT_PUBLIC_API_HOST}/api/packages`;

      const res = await fetch(url, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) throw new Error('Errore nel recupero pacchetti');
      const packages = await res.json();
      return packages;
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
    enabled: !!venueId, // Solo se abbiamo un venueId
  });
}
