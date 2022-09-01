import { BoardColumnModel } from "./board-column-model";

export interface BoardModel {
    name: string;
    column: BoardColumnModel[];
}
