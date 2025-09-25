import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";

export function useVenueOpeningDays() {
  return useQuery({
    queryKey: ["opening-days"],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/venues/opening-days`,
        {
          headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        },
      );
      if (!res.ok) throw new Error("Errore nel recupero opening days");
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateVenueOpeningDays() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (openingDays: any) => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/api/venues/opening-days`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify({ openingDays }),
        },
      );
      if (!res.ok) throw new Error("Errore durante il salvataggio");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["opening-days"] });
    },
  });
}
