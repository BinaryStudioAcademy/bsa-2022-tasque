import { UserModel } from "../user/user-model";

export interface TaskInfoModel {
    description: string;
    projectKey: string;
    user: UserModel;
    attachmentUrl: string;
}
