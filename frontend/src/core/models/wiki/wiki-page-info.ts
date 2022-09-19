export interface WikiPageInfo {
    id: number;
    name: string;
    text?: string;
    projectId: number;
    parentPageId?: number;
    nestedPages?: WikiPageInfo[];
}
