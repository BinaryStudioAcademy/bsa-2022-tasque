import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { NewProjectModel } from '../models/project/new-project-model';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ProjectModel } from '../models/project/project-model';
import { UserModel } from '../models/user/user-model';
import { EditProjectModel } from '../models/project/edit-project-model';
import { ProjectInfoModel } from '../models/project/project-info-model';
import { InviteUserModel } from '../models/project/invite-user-model';
import { ChangeUserRoleModel } from '../models/project/change-user-role-model';
import { TaskPriority } from '../models/task/task-priority';
import { BoardModel } from '../models/board/board-model';
import { TaskState } from '../models/task/task-state';
import { TaskModel } from '../models/task/task-model';
import { ProjectCardModel } from '../models/your-work/project-card-model';
import { TaskType } from '../models/task/task-type';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  public routePrefix = '/api/project';
  public routePrefixParticipants = '/api/ProjectParticipants';

  constructor(
    public httpService: HttpService
  ) { }

  createProject(newProject: NewProjectModel): Observable<HttpResponse<ProjectInfoModel>> {
    return this.httpService.postFullRequest<ProjectInfoModel>(this.routePrefix + '/create', newProject);
  }

  editProject(projectId: number, editProject: EditProjectModel): Observable<HttpResponse<ProjectInfoModel>> {
    return this.httpService.putFullRequest<ProjectInfoModel>(this.routePrefix + `/update/${projectId}`, editProject);
  }

  getAllProjectsOfThisOrganization(organizationId: number): Observable<HttpResponse<ProjectInfoModel[]>> {
    return this.httpService.getFullRequest<ProjectInfoModel[]>(this.routePrefix + `/all/${organizationId}`);
  }

  inviteUser(userInvite: InviteUserModel): Observable<HttpResponse<UserModel>> {
    return this.httpService.putFullRequest<UserModel>(this.routePrefixParticipants + '/invite', userInvite);
  }

  kickUser(userKick: InviteUserModel): Observable<void> {
    return this.httpService.putRequest<void>(this.routePrefixParticipants + '/kick', userKick);
  }

  changeUserRole(user: ChangeUserRoleModel): Observable<void> {
    return this.httpService.putRequest<void>(this.routePrefixParticipants + '/role', user);
  }

  getProjectById(id: number): Observable<HttpResponse<ProjectModel>> {
    return this.httpService.getFullRequest<ProjectModel>(this.routePrefix + '/getProjectById/' + id);
  }

  getBoard(projectId: number): Observable<HttpResponse<BoardModel>> {
    return this.httpService.getFullRequest(this.routePrefix + `/board/${projectId}`);
  }

  updateBoardTasks(boardInfo: BoardModel): Observable<HttpResponse<BoardModel>> {
    return this.httpService.putFullRequest(this.routePrefix + '/board/tasks', boardInfo);
  }

  updateBoardColumns(boardInfo: BoardModel): Observable<HttpResponse<BoardModel>> {
    return this.httpService.putFullRequest(this.routePrefix + '/board/columns', boardInfo);
  }

  getCurrentProjectInfoById(id: number): Observable<HttpResponse<ProjectInfoModel>> {
    return this.httpService.getFullRequest<ProjectInfoModel>(this.routePrefix + '/current/' + id);
  }

  getProjectsByOrganizationId(id: number): Observable<HttpResponse<ProjectModel[]>> {
    return this.httpService.getFullRequest<ProjectModel[]>(this.routePrefix + '/getByOrganizationId/' + id);
  }

  getProjectParticipants(id: number): Observable<HttpResponse<UserModel[]>> {
    return this.httpService.getFullRequest<UserModel[]>(this.routePrefixParticipants + `/${id}/participants/`);
  }

  getProjectPriorities(id: number): Observable<HttpResponse<TaskPriority[]>> {
    return this.httpService.getFullRequest(this.routePrefix + '/getProjectPriorities/' + id);
  }

  getProjectStates(id: number): Observable<HttpResponse<TaskState[]>> {
    return this.httpService.getFullRequest(this.routePrefix + '/getProjectStates/' + id);
  }

  getAllProjectTasks(id: number): Observable<HttpResponse<TaskModel[]>> {
    return this.httpService.getFullRequest('/api/task/getAllProjectTasks/' + id);
  }

  getProjectCards(): Observable<HttpResponse<ProjectCardModel[]>> {
    return this.httpService.getFullRequest(this.routePrefixParticipants + '/getProjectCards');
  }

  updateProjectTaskPriorities(projectId: number, taskPriorities: TaskPriority[]): Observable<HttpResponse<TaskPriority[]>> {
    return this.httpService.putFullRequest(this.routePrefix + `/taskPriorities/${projectId}`, taskPriorities);
  }

  updateProjectTaskStates(projectId: number, taskStates: TaskState[]): Observable<HttpResponse<TaskState[]>> {
    return this.httpService.putFullRequest(this.routePrefix + `/taskStates/${projectId}`, taskStates);
  }

  updateProjectTaskTypes(projectId: number, taskTypes: TaskType[]): Observable<HttpResponse<TaskType[]>> {
    return this.httpService.putFullRequest(this.routePrefix + `/taskTypes/${projectId}`, taskTypes);
  }
}
