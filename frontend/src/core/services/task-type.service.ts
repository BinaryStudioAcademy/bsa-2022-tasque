import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpService } from './http.service';
import { TaskType } from '../models/task/task-type';

@Injectable({
  providedIn: 'root',
})
export class TaskTypeService {
  public routePrefix = '/api/taskType';

  constructor(public httpService: HttpService) {}

  getAll(): Observable<HttpResponse<TaskType[]>> {
    return this.httpService.getFullRequest<TaskType[]>(
      this.routePrefix + '/getAll',
    );
  }

  getAllTaskTypesByProjectId(id: number) : Observable<HttpResponse<TaskType[]>> {
    return this.httpService.getFullRequest<TaskType[]>(this.routePrefix + '/getAllByProjectId/' + id);
  }
}
