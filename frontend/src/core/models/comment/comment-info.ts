import { UserModel } from "../user/user-model";

export interface CommentInfo {
    taskId: number;
    message: string;
    createdAt: Date;
    author: UserModel;
}
