import { BoardColumnModel } from "./board-column-model";

export interface BoardModel {
    id: number;
    projectId: number;
    name: string;
    columns: BoardColumnModel[];
}
