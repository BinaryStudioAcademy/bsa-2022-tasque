import { UserRoleModel } from './user-role-model';

export interface UserModel {
  id: number;
  name: string;
  email: string;
  avatarURL?: string;
  organizationRoles: UserRoleModel[];
}
