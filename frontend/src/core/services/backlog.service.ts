import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TaskModelDto } from '../models/task/task-model-dto';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class BacklogService {
  public routePrefix = '/api/backlog';

  private changeBacklogSource = new Subject<string>();
  changeBacklog$ = this.changeBacklogSource.asObservable();
  changeBacklog(): void {
    this.changeBacklogSource.next();
  }

  constructor(public httpService: HttpService) {}

  getBacklogTasks(projectId: number): Observable<HttpResponse<TaskModelDto[]>> {
    return this.httpService.getFullRequest<TaskModelDto[]>(
      this.routePrefix + `/backlogTasks/${projectId}`,
    );
  }
}
