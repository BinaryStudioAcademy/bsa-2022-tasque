import { TasqueDropdownOption } from 'src/shared/components/tasque-dropdown/dropdown.component';

export interface TaskCreateViewModel {
    currentUserId?: number;
    project?: TasqueDropdownOption;
    issueType?: TasqueDropdownOption;
    summary?: string;
    description?: string;
}
