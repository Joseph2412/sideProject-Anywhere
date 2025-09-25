"use client";

import { PackageForm } from "@repo/components";

import { useAtomValue } from "jotai";
import { packageFormAtom } from "@repo/ui/store/PackageFormStore";

export default function PackageFormPage() {
  const packageForm = useAtomValue(packageFormAtom);

  return (
    <div style={{ display: "flex" }}>
      <div style={{ flex: 1 }}>
        {!packageForm && (
          <div style={{ padding: 32, textAlign: "center", color: "#aaa" }}>
            Nessun pacchetto selezionato.
          </div>
        )}
        {packageForm && <PackageForm />}
      </div>
    </div>
  );
}
