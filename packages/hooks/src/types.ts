/**
 * Tipi condivisi per hooks e componenti dell'autenticazione
 * Pattern: Single Source of Truth per type definitions
 * AuthUser: Rappresenta l'utente autenticato con ruoli definiti
 * HostProfile: Dati estesi del profilo host con preferenze opzionali
 * Utilizzo: Evita duplicazione di tipi tra packages diversi
 */

// Shared types for hooks to maintain consistency
export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "HOST";
};

export type HostProfile = {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  preferences?: Record<string, unknown>;
};
