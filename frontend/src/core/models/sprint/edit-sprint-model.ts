import { TaskModel } from "../task/task-model";

export interface EditSprintModel {
  name: string,
  description?: string,  
  startAt: string,
  endAt: string,
  projectId: number,
  isStarting: boolean,
  Tasks: TaskModel[]
}
