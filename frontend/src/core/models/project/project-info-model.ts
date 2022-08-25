import { IUserCard } from "src/shared/components/select-users/Models";
import { UserModel } from "../user/user-model";

export interface ProjectInfoModel {
    id: number,
    name: string,
    authorId: number,
    organizationId: number,
    users: IUserCard[]
}
