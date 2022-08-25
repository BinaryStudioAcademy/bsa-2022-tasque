import { TasqueDropdownOption } from 'src/shared/components/tasque-dropdown/dropdown.component';

export interface TaskCreateViewModel {
    currentUser?: number;
    project?: TasqueDropdownOption;
    issueType?: TasqueDropdownOption;
    summary?: string;
    description?: string;
}
