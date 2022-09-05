import { UserRole } from "./user-roles";

export interface UserRoleModel {
    organizationId: number,
    userId: number,
    role: UserRole
}