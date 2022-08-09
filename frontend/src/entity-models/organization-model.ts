import { UserModel } from "./user-model";

export interface OrganizationModel{
    Id?: number,
    Name: string,
    Author?: UserModel,
    AuthorId: number
}