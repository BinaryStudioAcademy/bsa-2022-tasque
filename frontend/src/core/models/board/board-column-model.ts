import { TaskInfoModel } from './task-Info-model';

export interface BoardColumnModel {
    id: number;
    columnName: string;
    tasks: TaskInfoModel[];
}
