import { TaskFieldType } from "../task-field-types";

export interface TaskCustomFieldModel {
    fieldId: string,
    type?: TaskFieldType,
    fieldValue?: string,
}

