export interface VenueOpeningDay {
  day: number;
  isClosed: boolean;
  periods: {
    open: string;
    close: string;
  }[];
}

export interface PackagePlan {
  id: number;
  name: string;
  price: number;
}

export interface Package {
  id: number;
  name: string;
  description: string | null;
  type: string;
  squareMetres: number | null;
  capacity: number | null;
  photos: string[];
  plans: PackagePlan[];
}

export interface Venue {
  id: number;
  name: string;
  address: string;
  description: string | null;
  services: string[];
  photos: string[];
  logoURL: string | null;
  latitude: number | null;
  longitude: number | null;
  openingDays?: VenueOpeningDay[];
  packages?: Package[];
}

export interface VenueSearchParams {
  city?: string;
}
