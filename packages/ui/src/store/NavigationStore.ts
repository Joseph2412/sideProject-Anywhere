import { atom } from 'jotai';
import { atomWithStorage } from 'jotai/utils';

export type TabKey =
  | 'calendar'
  | 'gestione'
  | 'pagamenti'
  | 'aggiungi'
  | 'profilo'
  | 'preferenze'
  | 'pacchetti';

export const pageTitleAtom = atom<string>('Selected Tab');
export const selectedTabAtom = atomWithStorage<TabKey>('selectedTab', 'calendar');
