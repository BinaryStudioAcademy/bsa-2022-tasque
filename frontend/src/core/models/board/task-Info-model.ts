import { TaskPriority } from '../task/task-priority';
import { LabelField } from '../task/task-template-models/label-field';
import { TaskType } from '../task/task-type';
import { UserModel } from '../user/user-model';

export interface TaskInfoModel {
  id: number;
  type: TaskType;
  priority: TaskPriority;
  attachmentUrl: string;
  summary: string;
  order: number;
  customLabels: LabelField[];
  key: string;
  user?: UserModel;
  assignees?: UserModel[];
  isHidden: boolean;
}
