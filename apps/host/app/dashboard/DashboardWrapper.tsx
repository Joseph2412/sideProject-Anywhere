"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect } from "react";

export default function DashboardClient() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const name = searchParams.get("name");

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
    }
  }, [router]);
  const handleLogout = () => {
    localStorage.removeItem("token"); // ❌ Cancella token
    router.push("/login"); // 🔁 Redirect a login
  };

  return (
    <div>
      <h1>Ciao, {name ?? "utente"}</h1>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
}
