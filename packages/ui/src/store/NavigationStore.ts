// Stato di navigazione e layout: traccia la tab attiva e il titolo header

// TabKey: tutte le sezioni/tab disponibili nell'applicazione
export type TabKey =
  | 'calendar' // Sezione calendario
  | 'gestione' // Dettagli venue
  | 'pagamenti' // Setup pagamenti
  | 'aggiungi' // Aggiungi pacchetti
  | 'profilo' // Profilo utente
  | 'preferenze' // Notifiche e preferenze
  | 'pacchetti'; // Lista pacchetti

// ...atom rimosso: ora il titolo header si ricava dalla route

// ...atom rimosso: ora la tab attiva si ricava dalla route
