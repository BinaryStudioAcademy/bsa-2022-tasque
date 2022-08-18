import { TaskInfoModel } from './task-Info-model';

export interface BoardModel {
    columName: string;
    tasks: TaskInfoModel[];
}
