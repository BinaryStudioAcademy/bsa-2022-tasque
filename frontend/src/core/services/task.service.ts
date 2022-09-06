import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskModelDto } from '../models/task/task-model-dto';
import { TaskState } from '../models/task/task-state';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  public routePrefix = '/api/task';

  constructor(public httpService: HttpService) {}

  updateTask(
    taskId: number,
    task: TaskModelDto,
  ): Observable<HttpResponse<TaskModelDto>> {
    return this.httpService.putFullRequest<TaskModelDto>(
      this.routePrefix + `/update/${taskId}`,
      task,
    );
  }

  getTasksState(): Observable<HttpResponse<TaskState[]>> {
    return this.httpService.getFullRequest<TaskState[]>(
      this.routePrefix + `/getTasksState`,
    );
  }
}
