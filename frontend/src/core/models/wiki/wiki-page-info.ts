export interface WikiPageInfo {
    id: number;
    name: string;
    nestedPages?: WikiPageInfo[];
}
