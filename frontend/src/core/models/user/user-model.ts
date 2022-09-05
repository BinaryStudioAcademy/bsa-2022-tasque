import { UserRole } from "./user-roles";

export interface UserModel {
  id: number,
  name: string,
  email: string,
  avatarURL?: string,
  role?: UserRole
}
