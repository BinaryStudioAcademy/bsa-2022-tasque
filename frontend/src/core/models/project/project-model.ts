import { TaskPriority } from '../task/task-priority';
import { TaskState } from '../task/task-state';
import { TaskType } from '../task/task-type';
import { UserModel } from '../user/user-model';

export interface ProjectModel {
  id: number,
  name: string,
  key?: string,
  projectTaskPriorities?: TaskPriority[],
  projectTaskStates: TaskState[],
  projectTaskTypes: TaskType[],
  authorId: number,
  users: UserModel[],
  organizationId: number,
  createdAt: Date,
  updatedAt: Date,
}
