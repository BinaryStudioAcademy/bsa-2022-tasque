import { IconDefinition } from '@fortawesome/fontawesome-svg-core';

export interface TaskType {
  id: number,
  name: string,
  createdAt: Date,
  updatedAt: Date,
  icon?: IconDefinition
}
