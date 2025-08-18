/**
 * HEADER COMPONENT
 *
 * Component che renderizza l'intestazione dell'applicazione.
 * Mostra dinamicamente il titolo della sezione attiva e informazioni contestuali.
 *
 * CONCETTI CHIAVE:
 * - DYNAMIC TITLE: Titolo che cambia in base alla sezione selezionata
 * - REACTIVE UI: UI che reagisce automaticamente ai cambi di stato globale
 * - CONTEXTUAL HELP: Tooltip informativi per sezioni specifiche
 * - CSS MODULES: Stili isolati e type-safe
 *
 * RESPONSABILITÀ:
 * 1. Legge la tab attiva dal global state
 * 2. Converte la chiave tab in titolo human-readable
 * 3. Renderizza titolo con styling appropriato
 * 4. Mostra help contextual per sezioni complesse
 */

"use client"; // Client Component per interattività

// Import librerie UI
import { Tooltip, Typography } from "antd";
import { InfoCircleOutlined } from "@ant-design/icons";
import { useAtomValue } from "jotai";
import styles from "./Header.module.css";

// Import store per accesso stato globale
import { selectedTabAtom } from "@repo/ui/store/LayoutStore";

/**
 * TYPE DEFINITION: HeaderProps
 *
 * Props interface per il component Header.
 * Segue pattern di composizione per flessibilità.
 *
 * @param className - CSS class opzionale per override styling
 *
 * DESIGN PATTERN:
 * - className opzionale permette customizzazione dall'esterno
 * - Fallback a styles.header se non fornita
 * - Permette riuso del component in contesti diversi
 */
type HeaderProps = {
  className?: string; // CSS class opzionale per styling custom
};

/**
 * MAPPING OBJECT: keyToTitleMap
 *
 * Oggetto che mappa le chiavi tecniche delle tab ai titoli human-readable.
 * Centralizza la logica di traduzione chiave → display.
 *
 * STRUTTURA:
 * - Chiave: TabKey utilizzata nel routing/state
 * - Valore: Titolo da mostrare nell'UI
 *
 * ESEMPI:
 * - 'calendar' → 'Calendario'
 * - 'gestione' → 'Generali'
 * - 'pagamenti' → 'Pagamenti'
 *
 * PERCHÉ QUESTO PATTERN:
 * 1. SEPARATION OF CONCERNS: Logica di business vs presentazione
 * 2. MAINTAINABILITY: Facile aggiungere/modificare titoli
 * 3. CONSISTENCY: Stessa traduzione usata ovunque
 * 4. TYPE SAFETY: Record<string, string> garantisce struttura corretta
 *
 * IMPORTANTE:
 * - Deve essere sincronizzato con TabKey type nel NavigationStore
 * - Se manca una chiave, fallback a 'Benvenuto'
 */
const keyToTitleMap: Record<string, string> = {
  calendar: "Calendario", // Sezione gestione calendario
  gestione: "Generali", // Dettagli generali venue
  pagamenti: "Pagamenti", // Configurazione pagamenti
  aggiungi: "Aggiungi pacchetto", // Form creazione pacchetti
  profilo: "Profilo", // Gestione profilo utente
  preferenze: "Notifiche", // Impostazioni notifiche
};

/**
 * COMPONENT: Header
 *
 * Functional component che renderizza l'intestazione dinamica.
 *
 * @param className - CSS class opzionale per styling personalizzato
 * @returns JSX element con header strutturato
 *
 * RENDERING LOGIC:
 * 1. Legge tab attiva da global state
 * 2. Traduce chiave in titolo human-readable
 * 3. Renderizza titolo con Typography Ant Design
 * 4. Aggiunge tooltip specifici per sezioni che lo necessitano
 *
 * DESIGN PATTERNS:
 * - REACTIVE: Auto-update quando selectedTab cambia
 * - FALLBACK: Default a 'Benvenuto' se chiave non trovata
 * - CONDITIONAL RENDERING: Tooltip solo dove necessario
 */
export default function Header({ className }: HeaderProps) {
  /**
   * GLOBAL STATE READ
   *
   * Legge la tab attualmente selezionata dal global state.
   * useAtomValue è hook read-only per atoms Jotai.
   *
   * REATTIVITÀ:
   * - Component si ri-renderizza automaticamente quando selectedTab cambia
   * - Cambiamento può arrivare da Sidebar, routing, o altri componenti
   * - Garantisce UI sempre sincronizzata con stato applicazione
   */
  const selectedTab = useAtomValue(selectedTabAtom);

  /**
   * TITLE MAPPING
   *
   * Converte la chiave tecnica in titolo user-friendly.
   * Usa nullish coalescing (??) per fallback sicuro.
   *
   * LOGICA:
   * 1. Cerca selectedTab nel keyToTitleMap
   * 2. Se trovata, usa il titolo mappato
   * 3. Se non trovata (undefined), usa 'Benvenuto'
   *
   * ESEMPI:
   * - selectedTab='calendar' → pageTitle='Calendario'
   * - selectedTab='xyz' → pageTitle='Benvenuto' (fallback)
   */
  const pageTitle = keyToTitleMap[selectedTab] ?? "Benvenuto";

  /**
   * COMPONENT RENDER
   *
   * Struttura JSX dell'header con logica condizionale per elementi specifici.
   */
  return (
    <header className={className ?? styles.header}>
      {/* 
        MAIN TITLE 
        Typography.Title di Ant Design per consistent styling
      */}
      <Typography.Title level={4} style={{ margin: 0, color: "#000" }}>
        {pageTitle}

        {/* 
          CONDITIONAL TOOLTIP
          Mostra help icon solo per sezione Pagamenti
          Fornisce informazioni contestuali specifiche
        */}
        {pageTitle === "Pagamenti" && (
          <Tooltip title="Accrediteremo sul tuo conto corrente mensilmente il totale incassato al netto dei costi.">
            <InfoCircleOutlined
              style={{
                color: "#888", // Grigio discreto
                cursor: "pointer", // Indica interattività
                marginLeft: 7, // Spazio dal titolo
                fontSize: 14, // Dimensione icona
              }}
            />
          </Tooltip>
        )}
      </Typography.Title>
    </header>
  );
}
