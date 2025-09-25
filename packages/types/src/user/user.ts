import { Venue, User } from "@repo/database";

// esempio di tipo derivato da User di Prisma
export type UserLogin = Pick<User, "email" | "password">;

export type UserProfile = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: "USER" | "HOST";
  avatarUrl: string;
  preferences?: JSON | null;
  venue?: Venue | null;
};
