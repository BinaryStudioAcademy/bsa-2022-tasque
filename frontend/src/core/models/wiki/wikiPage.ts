export interface WikiPage {
    name: string;
    nestedPages?: WikiPage[];
}
