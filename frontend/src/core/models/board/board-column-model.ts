import { TaskInfoModel } from './task-Info-model';

export interface BoardColumnModel {
    columnName: string;
    tasks: TaskInfoModel[];
}
