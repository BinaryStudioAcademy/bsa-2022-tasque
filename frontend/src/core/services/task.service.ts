import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskModel } from '../models/task/task-model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  public routePrefix = '/api/task';

  constructor(public httpService: HttpService) {}

  updateTask(
    taskId: number,
    task: TaskModel,
  ): Observable<HttpResponse<TaskModel>> {
    return this.httpService.putFullRequest<TaskModel>(
      this.routePrefix + `/update/${taskId}`,
      task,
    );
  }
}
