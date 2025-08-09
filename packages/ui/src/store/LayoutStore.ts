import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type ToastPayload = {
  type?: 'success' | 'error' | 'info' | 'warning'; //Tipo del messagio
  message: string; //Titolo Del Messaggio
  description?: string; //Descrizione Testuale
  duration?: number; //Durata in secondi
  placement?: 'topLeft' | 'topRight' | 'bottomLeft' | 'bottomRight'; //Dove mettere Toast
  showOnce?: boolean; //Opzione Custom OPZIONALE per messaggi da Mostrare una sola volta
};
export const messageToast = atom<ToastPayload | false>(false);

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'HOST';
};
export const authUserAtom = atom<AuthUser | null>(null);

// Tipi Validi per i TabSelezionati in Sidebar
export type TabKey =
  | 'calendar'
  | 'gestione'
  | 'pagamenti'
  | 'aggiungi'
  | 'profilo'
  | 'preferenze'
  | 'pacchetti';

// Titolo Dinamico HEADER
export const pageTitleAtom = atom<string>('Selected Tab');

// Tab Selezionato di Default + Persistenza al Refresh
export const selectedTabAtom = atomWithStorage<TabKey>(
  'selectedTab',
  'calendar' // Idealmente apri la pagina Privata e vuoi vedere il Calendario
);

//Atomo Profilo USER
export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string; //
  avatarUrl: string;
  preferences?: Record<string, unknown>;
};

export const userProfileAtom = atom<UserProfile | null>(null);
