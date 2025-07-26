"use client";
import { useSearchParams } from "next/navigation";

export default function DashboardPage() {
  const searchParams = useSearchParams();
  const name = searchParams.get("name");

  return (
    <div>
      {name ? (
        <p>Benvenuto, {decodeURIComponent(name)}!</p>
      ) : (
        <p>Utente non riconosciuto</p>
      )}
    </div>
  );
}
