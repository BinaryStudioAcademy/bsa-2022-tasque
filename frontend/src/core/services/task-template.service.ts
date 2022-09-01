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

  public updateTAskTemplate(model: TaskTemplate): Observable<HttpResponse<TaskTemplate>> {
    return this.httpService.putFullRequest(this.routePrefix, model);
  }

  public getTemplateById(id: string): Observable<HttpResponse<TaskTemplate>> {
    return this.httpService.getFullRequest(this.routePrefix + '/' + id);
  }

  public getAllProjectTemplates(projectId: string): Observable<HttpResponse<TaskTemplate>> {
    return this.httpService.getFullRequest(this.routePrefix + '/' + projectId);
  }

  public deleteTemplate(id: string): Observable<HttpResponse<TaskTemplate>> {
    return this.httpService.deleteFullRequest(this.routePrefix + '/' + id);
  }
}
