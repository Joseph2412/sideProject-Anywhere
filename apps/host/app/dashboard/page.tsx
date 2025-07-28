import { Suspense } from "react";
import DashboardClient from "./DashboardWrapper";

export default function DashboardPage() {
  return (
    <Suspense fallback={<div>Caricamento...</div>}>
      <DashboardClient />
    </Suspense>
  );
}
