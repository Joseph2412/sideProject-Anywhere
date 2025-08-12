import { atom } from 'jotai';

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'HOST';
};

export type HostProfile = {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  preferences?: Record<string, unknown>;
};

export const authUserAtom = atom<AuthUser | null>(null);
export const hostProfileAtom = atom<HostProfile | null>(null);
