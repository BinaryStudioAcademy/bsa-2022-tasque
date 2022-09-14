import { TaskPriority } from '../task/task-priority';
import { LabelField } from '../task/task-template-models/label-field';
import { TaskType } from '../task/task-type';
import { UserModel } from '../user/user-model';

export interface TaskInfoModel {
    id: number;
    type?: TaskType;
    typeId: number;
    priority?: TaskPriority;
    priorityId?: number;
    state?: TaskState;
    stateId?: number;
    attachmentUrl: string;
    summary: string;
    customLabels: LabelField[];
    key: string;
    user?: UserModel;
    assignees?: UserModel[];
    isHidden: boolean;
}
