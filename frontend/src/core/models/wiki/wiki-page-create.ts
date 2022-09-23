export interface WikiPageCreate {
    name: string;
    projectId: number;
    parentPageId?: number;
}
