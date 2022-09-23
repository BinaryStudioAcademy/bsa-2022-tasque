import { UserRoleModel } from 'src/core/models/user/user-role-model';

export interface ProfileChangesModel {
  id: number;
  name: string;
  email: string;
  avatarURL?: string;
  organizationRoles: UserRoleModel[]
}
