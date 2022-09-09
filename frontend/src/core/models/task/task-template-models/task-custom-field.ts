import { CheckboxField } from './checkbox-field';
import { DropdownField } from './dropdown-field';
import { TaskFieldType } from '../task-field-types';
import { LabelField } from './label-field';

export interface TaskCustomField {
    name: string,
    type: TaskFieldType,
    fieldId?: string,

    labels?: LabelField[],
    dropdown?: DropdownField,
    checkboxes?: CheckboxField[],
}
