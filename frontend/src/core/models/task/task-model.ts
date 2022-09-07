import { ProjectModel } from '../project/project-model';
import { SprintModel } from '../sprint/sprint-model';
import { UserModel } from '../user/user-model';
import { TaskPriority } from './task-priority';
import { TaskState } from './task-state';
import { TaskType } from './task-type';

export interface TaskModel {
  id: number;
  summary: string;
  description?: string;
  state: TaskState;
  type: TaskType;
  priority: TaskPriority;
  author: UserModel;
  project: ProjectModel;
  sprint: SprintModel;
  lastUpdatedBy: UserModel;
  parentTaskId: number;
  createdAt: Date;
  updatedAt: Date;
  deadline: Date;
  finishedAt?: Date;
  estimate?: number;
}
