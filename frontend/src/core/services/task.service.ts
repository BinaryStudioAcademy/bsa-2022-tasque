import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { TaskCreateViewModel } from '../models/task/task-create-view-model';
import { HttpService } from './http.service';
import { Observable } from 'rxjs';
import { TaskModel } from '../models/task/task-model';
import { TaskUpdateModel } from '../models/task/task-update-model';
import { TaskCustomFieldModel } from '../models/task/task-creation-models/task-custom-field-model';

@Injectable({
  providedIn: 'root',
})
export class TaskService {
  private routePrefix = '/api/task';

  constructor(private httpService: HttpService) { }

  createTask(model: TaskCreateViewModel): Observable<HttpResponse<TaskModel>> {
    return this.httpService.postFullRequest(this.routePrefix, model);
  }

  getTaskById(id: number): Observable<HttpResponse<TaskModel>> {
    return this.httpService.getFullRequest(this.routePrefix + '/' + id);
  }

  getTaskCustomFieldsById(id: number): Observable<HttpResponse<TaskCustomFieldModel[]>> {
    return this.httpService.getFullRequest(this.routePrefix + '/customFields/' + id);
  }

  updateTask(model: TaskUpdateModel): Observable<HttpResponse<TaskModel>> {
    return this.httpService.putFullRequest(this.routePrefix, model);
  }

  deleteTask(id: number): Observable<HttpResponse<TaskModel>> {
    return this.httpService.deleteFullRequest(this.routePrefix + '/' + id);
  }

  setOrder(ids: number[]): Observable<HttpResponse<TaskModel[]>> {
    return this.httpService.postFullRequest(this.routePrefix + '/order', ids);
  }
}
