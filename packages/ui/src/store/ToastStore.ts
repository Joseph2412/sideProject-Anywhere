/**
 * STORE GESTIONE NOTIFICHE TOAST
 *
 * Questo file definisce la struttura e lo stato globale per gestire le notifiche toast
 * nell'applicazione. Un "toast" è una notifica temporanea che appare sullo schermo
 * per informare l'utente di eventi (successo, errore, warning, info).
 *
 * CONCETTI CHIAVE:
 * - JOTAI: Libreria per state management minimale e atomico
 * - ATOM: Unità di stato che può essere letta/scritta da qualsiasi componente
 * - TYPESCRIPT TYPES: Definizioni di tipo per garantire type safety
 */

import { atom } from 'jotai';

/**
 * TYPE DEFINITION: ToastPayload
 *
 * Definisce la struttura di una notifica toast.
 * Ogni proprietà ha uno scopo specifico:
 *
 * @param type - Il tipo di notifica che determina colore/icona ('success' = verde, 'error' = rosso, ecc.)
 * @param message - Il titolo principale della notifica (OBBLIGATORIO)
 * @param description - Testo aggiuntivo opzionale per dettagli
 * @param duration - Quanto tempo (in secondi) la notifica rimane visibile (default: 4.5s)
 * @param placement - Dove posizionare la notifica sullo schermo
 * @param showOnce - Se true, evita notifiche duplicate
 *
 * NOTA: Il "?" dopo il nome significa che la proprietà è OPZIONALE
 */
export type ToastPayload = {
  type?: 'success' | 'error' | 'info' | 'warning'; // Union type: solo questi valori permessi
  message: string; // Obbligatorio: deve sempre esserci
  description?: string; // Opzionale: testo aggiuntivo
  duration?: number; // Opzionale: secondi di durata
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'; // Posizione
  showOnce?: boolean; // Opzionale: evita duplicati
};

/**
 * ATOM GLOBALE: messageToast
 *
 * Questo è l'atom principale per gestire lo stato delle notifiche toast.
 *
 * FUNZIONAMENTO:
 * - Stato iniziale: false (nessuna notifica)
 * - Quando serve mostrare notifica: si imposta un oggetto ToastPayload
 * - Dopo aver mostrato la notifica: si resetta a false
 *
 * TIPO: ToastPayload | false
 * - false = nessuna notifica da mostrare
 * - ToastPayload = notifica da mostrare con i dati specifici
 *
 * UTILIZZO NEI COMPONENTI:
 * - LETTURA: const toast = useAtomValue(messageToast)
 * - SCRITTURA: const setToast = useSetAtom(messageToast)
 * - ESEMPIO: setToast({ type: 'success', message: 'Operazione completata!' })
 */
export const messageToast = atom<ToastPayload | false>(false);
