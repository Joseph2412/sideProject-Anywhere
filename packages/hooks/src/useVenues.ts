import { useQuery } from "@tanstack/react-query";

export function useVenues() {
  return useQuery({
    queryKey: ["venues"],
    queryFn: async () => {
      const token = localStorage.getItem("token");
      const [venuesRes, paymentsRes] = await Promise.all([
        fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/venues`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch(`${process.env.NEXT_PUBLIC_API_HOST}/api/venues/payments`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);
      if (!venuesRes.ok) throw new Error("Errore nel recupero venues");
      if (!paymentsRes.ok) throw new Error("Errore nel recupero pagamenti");
      const venues = await venuesRes.json();
      const payments = await paymentsRes.json();
      // Unisci i dati, aggiungendo payments come proprietà
      return { venues, payments };
    },
    staleTime: 5 * 60 * 1000,
  });
}
