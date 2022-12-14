import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { UserModel } from '../models/user/user-model';
import { Observable, Subject } from 'rxjs';
import { EditSprintModel } from '../models/sprint/edit-sprint-model';
import { SprintModel } from '../models/sprint/sprint-model';
import { HttpService } from './http.service';
import { TaskEstimateUpdate } from '../models/task/task-estimate-update';
import { TaskModel } from '../models/task/task-model';
import { NewSprintModel } from '../models/sprint/new-sprint-model';

@Injectable({
  providedIn: 'root',
})
export class SprintService {
  public routePrefix = '/api/sprint';

  private deleteSprintSource = new Subject<number>();
  deleteSprint$ = this.deleteSprintSource.asObservable();
  changeDeleteSprint(sprintId: number): void {
    this.deleteSprintSource.next(sprintId);
  }

  constructor(public httpService: HttpService) {}

  create(sprint: NewSprintModel): Observable<HttpResponse<SprintModel>> {
    return this.httpService.postFullRequest<SprintModel>(
      this.routePrefix,
      sprint,
    );
  }
  
  completeSprint(sprintId: number): Observable<void> {
    return this.httpService.putRequest<void>(
      this.routePrefix + `/complete/${sprintId}`,
      new Object(),
    );
  }

  getProjectSprints(
    projectId: number,
  ): Observable<HttpResponse<SprintModel[]>> {
    return this.httpService.getFullRequest<SprintModel[]>(
      this.routePrefix + `/getSprintsByProjectId/${projectId}`,
    );
  }

  getArchiveProjectSprints(
    projectId: number,
  ): Observable<HttpResponse<SprintModel[]>> {
    return this.httpService.getFullRequest<SprintModel[]>(
      this.routePrefix + `/getArchiveSprintsByProjectId/${projectId}`,
    );
  }

  getSprintTasks(sprintId: number): Observable<HttpResponse<TaskModel[]>> {
    return this.httpService.getFullRequest<TaskModel[]>(
      this.routePrefix + `/${sprintId}/tasks`,
    );
  }

  getSprintUsers(sprintId: number): Observable<HttpResponse<UserModel[]>> {
    return this.httpService.getFullRequest<UserModel[]>(
      this.routePrefix + `/${sprintId}/users`,
    );
  }

  editSprint(
    sprintId: number,
    editedSprint: EditSprintModel,
  ): Observable<HttpResponse<SprintModel>> {
    return this.httpService.putFullRequest<SprintModel>(
      this.routePrefix + `/update/${sprintId}`,
      editedSprint,
    );
  }

  updateOrder(
    editedSprint: SprintModel,
  ): Observable<HttpResponse<SprintModel>> {
    return this.httpService.putFullRequest<SprintModel>(
      this.routePrefix + '/updateOrder',
      editedSprint,
    );
  }

  updateTaskEstimate(
    taskEstimateUpdate: TaskEstimateUpdate,
  ): Observable<HttpResponse<void>> {
    return this.httpService.putFullRequest<void>(
      this.routePrefix + '/estimate',
      taskEstimateUpdate,
    );
  }

  delete(sprintId: number): Observable<HttpResponse<void>> {
    return this.httpService.deleteFullRequest<void>(
      this.routePrefix + `/delete/${sprintId}`,
    );
  }

  getCurrentSprintByProjectId(projectId: number): Observable<HttpResponse<SprintModel>> {
    return this.httpService.getFullRequest<SprintModel>(this.routePrefix + '/currentSprint/' + projectId);
  }
}
