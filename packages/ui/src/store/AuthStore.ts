// Store autenticazione utente: stato globale e dati profilo

import { atom } from "jotai";

// AuthUser: dati essenziali utente autenticato
export type AuthUser = {
  id: number; // Primary key dal database
  firstName: string; // Nome
  lastName: string; // Cognome
  email: string; // Email (univoca)
  role: "USER" | "HOST"; // Ruolo
  avatarUrl: string; // Path immagine profilo
  preferences?: Record<string, unknown>; // Impostazioni opzionali
};

// Atom globale: utente autenticato o null
export const authUserAtom = atom<AuthUser | null>(null);
