// Tipi condivisi per hooks e componenti (single source of truth)

export type CoworkingVenue = {
  id: number;
  name: string;
  address: string;
  description?: string;
  services?: string[];
  logoUrl?: string;
};

export type UserProfile = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'USER' | 'HOST';
  avatarUrl: string;
  preferences?: Record<string, unknown> | null;
  coworkingVenue?: CoworkingVenue | null;
};
