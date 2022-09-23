import { TaskCustomFieldModel } from './task-creation-models/task-custom-field-model';

export interface TaskCreateViewModel {
  summary?: string;
  description?: string;

  authorId?: number;
  projectId?: number;

  typeId?: number;
  priorityId?: number;
  stateId?: number;

  customFields?: TaskCustomFieldModel[];

  sprintId?: number;
}
