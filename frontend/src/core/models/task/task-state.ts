export interface TaskState {
  id: number,
  projectId: number,
  color?: string,
  name: string,
<<<<<<< HEAD

  createdAt?: Date,
  updatedAt?: Date
=======
  color?: string,
  projectId?: number,
  createdAt: Date,
  updatedAt: Date
>>>>>>> 5099a8a217cc1316f9c9ff96e25a368125750e29
}
