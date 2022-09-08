import { UserModel } from '../user/user-model';

export interface TaskInfoModel {
    id: number;
    summary: string;
    description: string;
    projectKey: string;
    user?: UserModel;
    attachmentUrl: string;
    isHidden: boolean;
}
