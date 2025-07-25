import { ROLE } from "../user/user"

export interface SignupPayload {
  email: string
  password: string
  name: string
  role: ROLE
}

export interface LoginPayload {
  email: string
  password: string
}
