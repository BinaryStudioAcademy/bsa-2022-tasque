import { UserModel } from '../user/user-model';
import { Attachment } from './attachment';
import { TaskCustomFieldModel } from './task-creation-models/task-custom-field-model';

export interface TaskUpdateModel {
  id: number;
  summary: string;
  description?: string;
  attachments: Attachment[];
  stateId?: number;
  typeId: number;
  priorityId?: number;
  projectId?: number;
  sprintId?: number;
  parentTaskId?: number;
  deadline: Date;
  finishedAt?: Date;
  estimate?: number;

  users?: UserModel[];
  customFields?: TaskCustomFieldModel[];
}
