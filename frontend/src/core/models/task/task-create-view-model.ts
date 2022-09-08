import { TasqueDropdownOption } from 'src/shared/components/tasque-dropdown/dropdown.component';
import { TaskCustomFieldModel } from './task-creation-models/task-custom-field-model';

export interface TaskCreateViewModel {
    summary?: string;
    description?: string;

    authorId?: number;
    projectId?: number;

    typeId?: number;

    customFields?: TaskCustomFieldModel[],
}
