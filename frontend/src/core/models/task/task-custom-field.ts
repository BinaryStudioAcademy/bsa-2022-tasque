import { DropdownField } from './dropdown-field';
import { LabelField } from './label-field';
import { TaskFieldType } from './task-field-types';

export interface TaskCustomField {
    name: string,
    type: TaskFieldType,

    labels?: LabelField[],
    dropdown?: DropdownField,
}
