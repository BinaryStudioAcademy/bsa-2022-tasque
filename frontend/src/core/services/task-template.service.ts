import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { TaskTemplate } from '../models/task/task-template';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root'
})
export class TaskTemplateService {

  constructor(
    private httpService: HttpService,
    ) { }

  private routePrefix = '/api/TaskTemplate';

  public createTaskTemplate(model: TaskTemplate): Observable<HttpResponse<TaskTemplate>> {
    return this.httpService.postFullRequest(this.routePrefix + '/saveTemplate', model);
  }
}
