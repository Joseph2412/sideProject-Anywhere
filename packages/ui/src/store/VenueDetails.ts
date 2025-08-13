import { atomWithStorage } from 'jotai/utils';

export type OpeningPeriod = {
  id: number;
  start: string;
  end: string;
};

export type OpeningDay = {
  id: number;
  day: string;
  close: string;
  isClosed: boolean;
  periods: OpeningPeriod[];
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
