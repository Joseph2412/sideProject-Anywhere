import { atom } from "jotai";

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
