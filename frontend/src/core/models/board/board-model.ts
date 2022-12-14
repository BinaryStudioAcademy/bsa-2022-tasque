import { UserModel } from '../user/user-model';
import { BoardColumnModel } from './board-column-model';

export interface BoardModel {
    id: number;
    projectId: number;
    name: string;
    projectName: string;
    users: UserModel[];
    columns: BoardColumnModel[];
}
