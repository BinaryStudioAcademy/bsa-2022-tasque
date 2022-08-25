export interface ProjectModel {
  id: number,
  name: string,
  key?: string,
  authorId: number,
  organizationId: number,
  createdAt: Date,
  updatedAt: Date,
}
