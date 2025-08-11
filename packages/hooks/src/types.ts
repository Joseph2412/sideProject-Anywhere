// Shared types for hooks to maintain consistency
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
