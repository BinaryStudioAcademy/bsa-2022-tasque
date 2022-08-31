import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { SprintModel } from '../models/sprint/sprint-model';
import { TaskModel } from '../models/task/task-model';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class SprintService {
  public routePrefix = '/api/sprint';

  constructor(public httpService: HttpService) {}

  getProjectSprints(
    projectId: number,
  ): Observable<HttpResponse<SprintModel[]>> {
    return this.httpService.getFullRequest<SprintModel[]>(
      this.routePrefix + `/getSprintsByProjectId/${projectId}`,
    );
  }

  getSprintTasks(sprintId: number): Observable<HttpResponse<TaskModel[]>> {
    return this.httpService.getFullRequest<TaskModel[]>(
      this.routePrefix + `/${sprintId}/tasks`,
    );
  }
}
