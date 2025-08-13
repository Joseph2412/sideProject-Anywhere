import { atomWithStorage } from 'jotai/utils';

export type OpeningDay = {
  id: number;
  day: string;
  isClosed: boolean;
  periods: string[]; // 🎯 Ora è array di stringhe: ["09:00-12:00", "14:00-18:00"]
};

export type ClosingPeriod = {
  id: number;
  start: string;
  end: string;
  isEnable: boolean;
};

export type Package = {
  id: number;
  title: string;
  description?: string;
  squareMetres: number;
  capacity: number;
  services: string[];
  type: string;
  plans: string[];
  photos: string[];
};

export type VenueDetails = {
  id: number;
  name: string;
  address: string;
  description?: string;
  services: string[];
  avatarURL?: string;
  photos: string[];
  openingDays: OpeningDay[];
  closingPeriods: ClosingPeriod[];
  packages: Package[];
};

export const venueAtom = atomWithStorage<VenueDetails | null>('venueDetails', null);
//Richiamo un'atomo che contiene tutti gli altri
