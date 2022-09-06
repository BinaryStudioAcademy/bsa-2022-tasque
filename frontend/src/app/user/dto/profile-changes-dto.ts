import { UserRoleModel } from 'src/core/models/user/user-role-model';

export interface ProfileChangesDTO {
  id: number;
  name: string;
  email: string;
  avatarURL?: string;
  organizationRoles: UserRoleModel[]
}
