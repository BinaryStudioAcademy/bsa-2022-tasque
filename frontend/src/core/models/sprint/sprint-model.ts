import { TaskModel } from '../task/task-model';

export interface SprintModel {
  id: number;
  name: string;
  description?: string;
  tasks?: TaskModel[];
  createdAt: Date;
  updatedAt: Date;
}
