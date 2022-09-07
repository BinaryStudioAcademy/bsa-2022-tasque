import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskState } from '../models/task/task-state';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class TaskStateService {
  public routePrefix = '/api/taskState';

  constructor(public httpService: HttpService) {}

  getAll(): Observable<HttpResponse<TaskState[]>> {
    return this.httpService.getFullRequest<TaskState[]>(
      this.routePrefix + '/getAll',
    );
  }
}
