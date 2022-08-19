import { TaskPriority } from '../enums/task-priority';
import { TaskState } from '../enums/task-state';
import { TaskType } from '../enums/task-type';

export interface TaskModel {
  id: number,
  name: string,
  description?: string,
  summary: string,
  taskState: TaskState,
  taskType: TaskType,
  taskPriority: TaskPriority,
  authorId: number,
  projectId: number,
  sprintId: number,
  lastUpdatedById: number,
  parentTaskId: number,
  createdAt: Date,
  updatedAt: Date,
  deadLine: Date,
  finishedAt?: Date,
}
