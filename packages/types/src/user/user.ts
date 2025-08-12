import { User } from '@repo/database';

// esempio di tipo derivato da User di Prisma
export type UserLogin = Pick<User, 'email' | 'password'>;

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
