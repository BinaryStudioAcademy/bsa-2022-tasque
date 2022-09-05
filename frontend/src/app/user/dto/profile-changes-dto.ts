import { UserRole } from "src/core/models/user/user-roles";

export interface ProfileChangesDTO {
  id: number;
  name: string;
  email: string;
  avatarURL?: string;
  role?: UserRole
}
