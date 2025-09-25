// Header: mostra il titolo della sezione attiva e info contestuali. Responsive e dinamico.

"use client";

// UI libraries
import { Tooltip, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import styles from "./Header.module.css";
import { usePathname } from "next/navigation";

//Atomi per Il Nome dell'HEADER
import { useAtomValue } from "jotai";
import { packageFormAtom } from "@repo/ui/store/PackageFormStore";

// Store per stato globale

type HeaderProps = {
  className?: string; // CSS class opzionale
};

// Mappa chiave tab → titolo visualizzato
const keyToTitleMap: Record<string, string> = {
  calendar: "Calendario",
  venue: "Generali",
  profile: "Profilo",
  preferences: "Notifiche",
  payments: "Pagamenti",
};

// Header component
export default function Header({ className }: HeaderProps) {
  const packageForm = useAtomValue(packageFormAtom);

  // Legge la tab attiva dal global state
  const pathname = usePathname();
  const selectedTab = pathname.split("/").pop();

  // Converte la chiave tecnica in titolo user-friendly
  const pageTitle = packageForm?.name
    ? `${packageForm.name}`
    : (keyToTitleMap[selectedTab as string] ?? "HomePage");

  // Render JSX header
  return (
    <header className={className ?? styles.header}>
      <Typography.Title level={4} style={{ margin: 0, color: "#000" }}>
        {pageTitle}

        {pageTitle === "Pagamenti" && (
          <Tooltip title="Accrediteremo sul tuo conto corrente mensilmente il totale incassato al netto dei costi.">
            <InfoCircleOutlined
              style={{
                color: "#888", // Grigio
                cursor: "pointer",
                marginLeft: 7,
                fontSize: 14,
              }}
            />
          </Tooltip>
        )}
      </Typography.Title>
    </header>
  );
}
