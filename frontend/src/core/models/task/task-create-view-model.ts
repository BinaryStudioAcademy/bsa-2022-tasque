export interface TaskCreateViewModel {
    currentUser?: number;
    project?: [string, string, number];
    issueType?: [string, string, number];
    summary?: string;
    description?: string;
}
