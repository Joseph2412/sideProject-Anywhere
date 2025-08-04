import { User } from '@repo/database';

// esempio di tipo derivato da User di Prisma
export type UserLogin = Pick<User, 'email' | 'password'>;
