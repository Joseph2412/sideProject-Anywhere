"use client";

import { useSearchParams } from "next/navigation";

export default function DashboardClient() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  return <h1>Ciao, {name ?? "utente"}</h1>;
}
