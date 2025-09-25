import { useQuery } from "@tanstack/react-query";

export function usePreferences(token: string) {
  return useQuery({
    queryKey: ["preferences", token],
    queryFn: async () => {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API_HOST}/user/preferences`,
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      );
      if (!res.ok) throw new Error("Non Autorizzato");
      return res.json();
    },
    enabled: !!token,
    staleTime: 5 * 60 * 1000,
  });
}
