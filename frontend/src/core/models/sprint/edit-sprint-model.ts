export interface EditSprintModel {
  id: number,
  name: string,
  description?: string,  
  startAt?: string,
  endAt?: string,
  projectId: number,
  isStarting: boolean,
  tasks: number[]
}
