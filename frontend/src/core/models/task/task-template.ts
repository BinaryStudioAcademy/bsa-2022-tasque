import { TaskCustomField } from './task-custom-field';

export interface TaskTemplate {
    projectId: number,
    typeId: number,

    customContextFields: TaskCustomField[],
    customDescriptionFields: TaskCustomField[],
}

