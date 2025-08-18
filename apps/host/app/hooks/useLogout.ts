"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

/**
 * Hook personalizzato per gestire il logout dell'utente
 * Pattern: useCallback per ottimizzazione performance - evita re-render inutili
 * Operazioni: rimozione token + redirect alla pagina login
 * Dependency: [router] per mantenere referenza stabile della funzione
 */
export function useLogout() {
  const router = useRouter();

  return useCallback(() => {
    localStorage.removeItem("token");
    router.replace("/login");
  }, [router]);
}
