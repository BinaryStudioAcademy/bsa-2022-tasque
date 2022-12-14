import { TaskCustomField } from './task-template-models/task-custom-field';

export interface TaskTemplate {
    id?: string,
    projectId: number,
    typeId?: number,

    customFields: TaskCustomField[],
}

