/**
 * BARREL EXPORT - STORE MODULES
 *
 * Questo file centralizza tutti gli export dei moduli di state management.
 * È il punto di accesso unificato per tutti gli store dell'applicazione.
 *
 * PATTERN BARREL EXPORT:
 * - Singolo punto di import per tutti gli store
 * - Evita import multipli e path complessi
 * - Facilita refactoring e riorganizzazione
 *
 * UTILIZZO:
 * import { authUserAtom, messageToast, selectedTabAtom } from '@repo/ui/store'
 *
 * INVECE DI:
 * import { authUserAtom } from '@repo/ui/store/AuthStore'
 * import { messageToast } from '@repo/ui/store/ToastStore'
 * import { selectedTabAtom } from '@repo/ui/store/NavigationStore'
 *
 * VANTAGGI:
 * 1. DX (Developer Experience): Import più puliti
 * 2. Manutenibilità: Facile spostare/rinominare store
 * 3. Tree-shaking: Bundler può ottimizzare import inutilizzati
 * 4. Consistenza: Pattern uniforme in tutto il monorepo
 */

// Store per gestione autenticazione e profili utente
export * from "./AuthStore";

// Store per gestione notifiche toast/messaggi
export * from "./ToastStore";

// Store per gestione navigazione e tab layout
export * from "./NavigationStore";

// Store per gestione dati venue completi
export * from "./VenueDetails";

// Store legacy per compatibilità (da verificare se utilizzato)
export * from "./LayoutStore";
