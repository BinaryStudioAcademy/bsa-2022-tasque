import { UserModel } from './user-model';

export interface OrganizationModel{
    Id?: number,
    Name: string,
    AuthorId: number,
    Author?: UserModel
}

