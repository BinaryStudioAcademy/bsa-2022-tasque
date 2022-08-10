import { UserModel } from './user-model';

export interface OrganizationModel{
    id?: number,
    name: string,
    authorId: number,
    author?: UserModel
}

