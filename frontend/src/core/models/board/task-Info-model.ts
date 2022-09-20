import { Attachment } from '../task/attachment';
import { TaskPriority } from '../task/task-priority';
import { LabelField } from '../task/task-template-models/label-field';
import { TaskType } from '../task/task-type';
import { UserModel } from '../user/user-model';
import { TaskState } from '../task/task-state';

export interface TaskInfoModel {
    id: number;
    type?: TaskType;
    typeId: number;
    priority?: TaskPriority;
    priorityId?: number;
    state?: TaskState;
    stateId?: number;
    summary: string;
    customLabels: LabelField[];
    key: string;
    estimate?: number,
    author?: UserModel;
    assignees?: UserModel[];
    attachments: Attachment[],
    createdAt: Date,
    updatedAt: Date,
    deadline: Date,
    isHidden: boolean;
}
