import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { TaskModel } from '../models/task/task-model';

@Injectable({ providedIn: 'root' })
export class TaskStorageService {
    constructor() { }
    private taskUpdatedSubj = new Subject<TaskModel>();
    public taskUpdated$ = this.taskUpdatedSubj.asObservable();

    public updateTask(task: TaskModel): void {
        this.taskUpdatedSubj.next(task);
    }
}
