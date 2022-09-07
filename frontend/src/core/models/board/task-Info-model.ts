import { UserModel } from '../user/user-model';

export interface TaskInfoModel {
    id: number;
    description: string;
    projectKey: string;
    user?: UserModel;
    attachmentUrl: string;
    isHidden: boolean;
}
