"use client";
import { useRouter } from "next/navigation";
import { useCallback } from "react";

export function useLogout() {
  const router = useRouter();

  return useCallback(() => {
    localStorage.removeItem("token");
    router.replace("/login");
  }, [router]);
}
