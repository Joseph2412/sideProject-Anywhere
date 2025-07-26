import { Role } from "@repo/database";

export interface SignupPayload {
  email: string;
  password: string;
  name: string;
  role: Role;
}

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RestorePasswordPayload {
  token: string;
  newPassword: string;
}
