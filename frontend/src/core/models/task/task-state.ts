export interface TaskState {
  id: number;
  projectId?: number;
  color?: string;
  name: string;
  createdAt?: Date;
  updatedAt?: Date;
  status?: boolean;
}
