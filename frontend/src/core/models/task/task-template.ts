import { TaskCustomField } from './task-custom-field';

export interface TaskTemplate {
    id: number,

    customDescriptionFields: TaskCustomField[],
    customContextFields: TaskCustomField[],
}

