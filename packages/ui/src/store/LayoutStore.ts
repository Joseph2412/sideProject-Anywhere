import { atom } from "jotai";
import { atomWithStorage } from "jotai/utils";

export type ToastPayload = {
  type?: "success" | "error" | "info" | "warning";
  message: string;
  description?: string;
  duration?: number;
  placement?: "topLeft" | "topRight" | "bottomLeft" | "bottomRight";
};
export const messageToast = atom<ToastPayload | false>(false);

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: "USER" | "HOST";
};
export const authUserAtom = atom<AuthUser | null>(null);

// Tipi Validi per i TabSelezionati
export type TabKey = "calendar" | "gestione" | "orari" | "aggiungi" | "profilo";

// Titolo Dinamico HEADER
export const pageTitleAtom = atom<string>("Selected Tab");

// Tab Selezionato di Default + Persistenza al Refresh
export const selectedTabAtom = atomWithStorage<TabKey>(
  "selectedTab",
  "calendar",
);
