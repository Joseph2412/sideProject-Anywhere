import { useQuery } from "@tanstack/react-query";

export function useUserProfile() {
  return useQuery({
    queryKey: ["profile"], // <--- Cambia qui
    queryFn: async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        throw new Error("Token di autenticazione non trovato");
      }
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/user/profile`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        },
      );
      if (!res.ok) {
        throw new Error(`Errore ${res.status}: ${res.statusText}`);
      }
      return res.json();
    },
    staleTime: 5 * 60 * 1000,
  });
}
