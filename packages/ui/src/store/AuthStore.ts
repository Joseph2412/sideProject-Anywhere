/**
 * STORE AUTENTICAZIONE UTENTE
 *
 * Questo file gestisce tutto lo stato globale relativo all'autenticazione dell'utente.
 * Contiene le informazioni dell'utente loggato e del suo profilo dettagliato.
 *
 * CONCETTI CHIAVE:
 * - STATE MANAGEMENT: Gestione centralizzata dello stato dell'app
 * - AUTHENTICATION: Processo di verifica identità utente
 * - GLOBAL STATE: Stato condiviso tra tutti i componenti dell'app
 *
 * ARCHITETTURA:
 * - AuthUser: Dati essenziali dell'utente autenticato (da JWT token)
 * - HostProfile: Dati estesi del profilo (da database)
 * - Due atom separati per gestire i due tipi di informazioni
 */

import { atom } from "jotai";

/**
 * TYPE DEFINITION: AuthUser
 *
 * Rappresenta le informazioni ESSENZIALI dell'utente autenticato.
 * Questi dati vengono estratti dal JWT token dopo il login.
 *
 * QUANDO SI USA:
 * - Dopo login/signup per identificare l'utente
 * - Per controlli di autorizzazione
 * - Per display nome utente in header/sidebar
 *
 * @param id - Identificativo unico utente nel database (chiave primaria)
 * @param name - Nome completo dell'utente per display
 * @param email - Email utilizzata per login (deve essere unica)
 * @param role - Ruolo dell'utente nel sistema ('USER' = cliente, 'HOST' = gestore venue)
 */
export type AuthUser = {
  id: number; // Primary key dal database
  name: string; // Nome per display UI
  email: string; // Email univoca per login
  role: "USER" | "HOST"; // Union type: solo questi due ruoli esistono
};

/**
 * TYPE DEFINITION: HostProfile
 *
 * Rappresenta le informazioni DETTAGLIATE del profilo host.
 * Questi dati vengono caricati dal database dopo l'autenticazione.
 *
 * QUANDO SI USA:
 * - Nel form profilo per editing
 * - Per display avatar e informazioni complete
 * - Per gestione preferenze personalizzate
 *
 * @param firstName - Nome separato per editing granulare
 * @param lastName - Cognome separato per editing granulare
 * @param email - Email (duplicata da AuthUser per convenienza)
 * @param avatarUrl - URL immagine profilo (S3/CDN)
 * @param preferences - Oggetto JSON per impostazioni personalizzate (opzionale)
 */
export type HostProfile = {
  firstName: string; // Nome editabile separatamente
  lastName: string; // Cognome editabile separatamente
  email: string; // Email (duplicata per convenienza)
  avatarUrl: string; // Path immagine profilo
  preferences?: Record<string, unknown>; // Oggetto JSON flessibile per impostazioni
};

/**
 * ATOM GLOBALE: authUserAtom
 *
 * Contiene le informazioni essenziali dell'utente autenticato.
 *
 * CICLO DI VITA:
 * 1. Iniziale: null (utente non loggato)
 * 2. Dopo login: AuthUser object (utente autenticato)
 * 3. Dopo logout: null (reset stato)
 *
 * QUANDO VIENE AGGIORNATO:
 * - Al login/signup (da risposta API)
 * - Al reload della pagina (verifica token)
 * - Al logout (reset a null)
 *
 * TIPO: AuthUser | null
 * - null = utente non autenticato
 * - AuthUser = utente loggato con dati validi
 */
export const authUserAtom = atom<AuthUser | null>(null);

/**
 * ATOM GLOBALE: hostProfileAtom
 *
 * Contiene le informazioni dettagliate del profilo host.
 *
 * CICLO DI VITA:
 * 1. Iniziale: null (profilo non caricato)
 * 2. Dopo caricamento: HostProfile object (profilo completo)
 * 3. Dopo logout: null (reset stato)
 *
 * QUANDO VIENE AGGIORNATO:
 * - Dopo login (caricamento profilo da API)
 * - Dopo aggiornamento profilo (save modifiche)
 * - Al reload della pagina (ricaricamento dati)
 * - Al logout (reset a null)
 *
 * TIPO: HostProfile | null
 * - null = profilo non caricato o utente non loggato
 * - HostProfile = profilo completo caricato
 */
export const hostProfileAtom = atom<HostProfile | null>(null);
