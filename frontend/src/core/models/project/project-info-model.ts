import { IUserCard } from 'src/shared/components/select-users/Models';

export interface ProjectInfoModel {
    id: number,
    name: string,
    key: string,
    authorId: number,
    organizationId: number,
    users: IUserCard[]
}
