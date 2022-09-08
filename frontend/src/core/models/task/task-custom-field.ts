import { CheckboxField } from './checkbox-field';
import { DropdownField } from './dropdown-field';
import { LabelField } from './label-field';
import { TaskFieldType } from './task-field-types';

export interface TaskCustomField {
    name: string,
    type: TaskFieldType,
    fieldId?: string,

    labels?: LabelField[],
    dropdown?: DropdownField,
    checkboxes?: CheckboxField[],
}
