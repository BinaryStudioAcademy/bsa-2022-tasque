import { TaskModel } from "../task/task-model";

export interface EditSprintModel {
  id: number,
  name: string,
  description?: string,  
  startAt?: string,
  endAt?: string,
  projectId: number,
  isStarting: boolean,
  tasks: TaskModel[]
}
