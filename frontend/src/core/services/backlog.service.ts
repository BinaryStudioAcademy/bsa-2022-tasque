import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { TaskModel } from '../models/task/task-model';
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

  constructor(public httpService: HttpService) { }

  getBacklogTasks(projectId: number): Observable<HttpResponse<TaskModel[]>> {
    return this.httpService.getFullRequest<TaskModel[]>(
      this.routePrefix + `/backlogTasks/${projectId}`,
    );
  }
}
