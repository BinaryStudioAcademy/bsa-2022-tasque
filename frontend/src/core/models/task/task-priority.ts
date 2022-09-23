export interface TaskPriority {
  id: number,
  projectId: number,
  color?: string,

  name: string,
  createdAt?: Date,
  updatedAt?: Date
}
