/**
 * STORE NAVIGAZIONE E LAYOUT
 *
 * Questo file gestisce lo stato della navigazione nell'applicazione.
 * Controlla quale tab è attiva nella sidebar e quale titolo mostrare nell'header.
 *
 * CONCETTI CHIAVE:
 * - NAVIGATION STATE: Stato che traccia dove si trova l'utente nell'app
 * - PERSISTENT STATE: Stato salvato nel localStorage che sopravvive al reload
 * - TAB SYSTEM: Sistema di navigazione basato su tab/sezioni
 *
 * ARCHITETTURA:
 * - TabKey: Enum che definisce tutte le sezioni disponibili
 * - selectedTabAtom: Atom persistente per tracciare tab attiva
 * - pageTitleAtom: Atom per sincronizzare titolo header
 */

import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

/**
 * TYPE DEFINITION: TabKey
 *
 * Union type che definisce tutte le sezioni/tab disponibili nell'applicazione.
 * Ogni stringa corrisponde a una sezione specifica con contenuto dedicato.
 *
 * MAPPING FUNZIONALE:
 * - 'calendar': Sezione calendario prenotazioni
 * - 'gestione': Gestione dettagli venue (informazioni generali)
 * - 'pagamenti': Configurazione pagamenti e fatturazione
 * - 'aggiungi': Form per aggiungere nuovi pacchetti/servizi
 * - 'profilo': Gestione profilo utente host
 * - 'preferenze': Impostazioni notifiche e preferenze
 * - 'pacchetti': Lista e gestione pacchetti esistenti
 *
 * NOTA: Ogni valore deve corrispondere esattamente alle chiavi usate nella sidebar
 * e nel switch del layout per il rendering del contenuto corretto.
 */
export type TabKey =
  | "calendar" // Sezione calendario
  | "gestione" // Dettagli venue
  | "pagamenti" // Setup pagamenti
  | "aggiungi" // Aggiungi pacchetti
  | "profilo" // Profilo utente
  | "preferenze" // Notifiche e preferenze
  | "pacchetti"; // Lista pacchetti

/**
 * ATOM GLOBALE: pageTitleAtom
 *
 * Contiene il titolo da mostrare nell'header dell'applicazione.
 * Si aggiorna automaticamente quando cambia la tab selezionata.
 *
 * UTILIZZO:
 * - Header component legge questo atom per mostrare titolo corretto
 * - Sidebar aggiorna questo atom quando utente cambia sezione
 * - Layout può impostare titoli personalizzati per sezioni speciali
 *
 * TIPO: string
 * - Valore di default: 'Selected Tab'
 * - Valori tipici: 'Calendario', 'Pagamenti', 'Profilo', ecc.
 */
export const pageTitleAtom = atom<string>("Selected Tab");

/**
 * ATOM PERSISTENTE: selectedTabAtom
 *
 * Traccia quale tab/sezione è attualmente selezionata dall'utente.
 * Utilizza atomWithStorage per persistere la selezione nel localStorage.
 *
 * PERSISTENZA:
 * - Salvato automaticamente nel localStorage con chiave 'selectedTab'
 * - Ripristinato automaticamente al reload della pagina
 * - Permette all'utente di ritornare all'ultima sezione visitata
 *
 * FUNZIONAMENTO:
 * 1. Utente clicca su voce sidebar
 * 2. Sidebar aggiorna questo atom
 * 3. Layout legge atom e renderizza componente corrispondente
 * 4. Header legge atom e aggiorna titolo
 * 5. Valore salvato in localStorage per persistenza
 *
 * TIPO: TabKey
 * - Valore di default: 'calendar' (sezione iniziale)
 * - Possibili valori: vedere TabKey union type sopra
 *
 * STORAGE KEY: 'selectedTab'
 * - Chiave usata nel localStorage per salvare/ripristinare valore
 */
export const selectedTabAtom = atomWithStorage<TabKey>(
  "selectedTab",
  "calendar",
);
