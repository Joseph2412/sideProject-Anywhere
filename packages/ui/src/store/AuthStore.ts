import { atom } from 'jotai';

export type AuthUser = {
  id: number;
  name: string;
  email: string;
  role: 'USER' | 'HOST';
};

export type UserProfile = {
  firstName: string;
  lastName: string;
  email: string;
  avatarUrl: string;
  preferences?: Record<string, unknown>;
};

export const authUserAtom = atom<AuthUser | null>(null);
export const userProfileAtom = atom<UserProfile | null>(null);
