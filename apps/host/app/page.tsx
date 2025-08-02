// apps/host/app/page.tsx
"use client";

import { useRouter } from "next/navigation";
import { Button } from "antd";

export default function PublicHome() {
  const router = useRouter();

  return (
    <div style={{ padding: "2rem" }}>
      <h1>Benvenuto su Nibol!</h1>
      <p>Accedi per gestire il tuo locale.</p>
      <Button onClick={() => router.push("/login")}>Accedi</Button>
      <Button
        onClick={() => router.push("/signup")}
        style={{ marginLeft: "1rem" }}
      >
        Registrati
      </Button>
    </div>
  );
}
