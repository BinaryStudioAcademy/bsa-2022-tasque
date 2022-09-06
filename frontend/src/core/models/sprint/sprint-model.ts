import { TaskModel } from 'src/core/models/task/task-model';
import { TaskModelDto } from '../task/task-model-dto';

export interface SprintModel {
  id: number;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
  startAt?: Date;
  endAt?: Date;
  projectId: number;
  tasks: TaskModelDto[];
  order?: number;
}
