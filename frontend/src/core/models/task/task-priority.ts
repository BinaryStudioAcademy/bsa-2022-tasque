import { TaskPriorityType } from "./enums/task-priority-types";

export interface TaskPriority {
  id: number,
  projectId: number,
  type: TaskPriorityType,
  color?: string,

  name: string,
  createdAt: Date,
  updatedAt: Date
}
