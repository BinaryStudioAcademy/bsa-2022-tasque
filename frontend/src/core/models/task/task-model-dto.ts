import { UserModel } from '../user/user-model';

export interface TaskModelDto {
  id: number;
  summary: string;
  description?: string;
  stateId: number;
  typeId: number;
  priorityId: number;
  authorId: number;
  projectId: number;
  sprintId?: number;
  lastUpdatedById: number;
  parentTaskId: number;
  createdAt: Date;
  updatedAt: Date;
  deadline: Date;
  finishedAt?: Date;
  estimate?: number;
  users: UserModel[];
}
