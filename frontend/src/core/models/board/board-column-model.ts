import { TaskInfoModel } from './task-Info-model';

export interface BoardColumnModel {
    id: number;
    name: string;
    tasks: TaskInfoModel[];
}
