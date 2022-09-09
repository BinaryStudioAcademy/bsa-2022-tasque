import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskCreateViewModel } from '../models/task/task-create-view-model';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { TaskModel } from '../models/task/task-model';

@Injectable({
  providedIn: 'root'
})
export class TaskService {

  private routePrefix = '/api/task';

  constructor(
    private httpService: HttpService,
  ) { }

  createTask(model: TaskCreateViewModel): Observable<HttpResponse<TaskCreateViewModel>> {
    return this.httpService.postFullRequest(this.routePrefix, model);
  }

  getTaskById(id: number): Observable<HttpResponse<TaskModel>> {
    return this.httpService.getFullRequest(this.routePrefix + '/' + id);
  }

  updateTask(model: TaskModel) : Observable<HttpResponse<TaskModel>> {
    return this.httpService.postFullRequest(this.routePrefix, model);
  }

  deleteTask(id: number) : Observable<HttpResponse<TaskModel>> {
    return this.httpService.deleteFullRequest(this.routePrefix + '/' + id);
  }
}
