import { useQuery } from '@tanstack/react-query';

export function usePackages() {
  return useQuery({
    queryKey: ['packages'],
    queryFn: async () => {
      const token = localStorage.getItem('token');
      const [packagesRes, plansRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/packages/:id`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/packages/:id/plans`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (!packagesRes.ok) throw new Error('Errore nel recupero pacchetti');
      if (!plansRes.ok) throw new Error('Errore nel recupero piani');
      const packages = await packagesRes.json();
      const plans = await plansRes.json();
      return { packages, plans };
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}
