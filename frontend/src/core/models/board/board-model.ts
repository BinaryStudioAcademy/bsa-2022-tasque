import { TaskInfoModel } from './task-Info-model';

export interface BoardModel {
    columnName: string;
    tasks: TaskInfoModel[];
}
