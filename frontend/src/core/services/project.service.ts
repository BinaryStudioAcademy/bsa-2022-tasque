import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { NewProjectModel } from '../models/project/new-project-model';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ProjectModel } from '../models/project/project-model';
import { UserModel } from '../models/user/user-model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  public routePrefix = '/api/project';

  constructor(
    public httpService: HttpService
  ) { }

  createProject(newProject: NewProjectModel):Observable<HttpResponse<ProjectModel>>{
    return this.httpService.postFullRequest<ProjectModel>(this.routePrefix + '/create', newProject);
  }

  getProjectById(id: number): Observable<HttpResponse<ProjectModel>> {
    return this.httpService.getFullRequest<ProjectModel>(this.routePrefix + '/getById/' + id);
  }

  getProjectsByOrganizationId(id: number): Observable<HttpResponse<ProjectModel[]>> {
    return this.httpService.getFullRequest<ProjectModel[]>(this.routePrefix + '/getByOrganizationId/' + id);
  }

  getProjectParticipants(id: number): Observable<HttpResponse<UserModel[]>> {
    return this.httpService.getFullRequest<UserModel[]>(this.routePrefix + '/getParticipants/' + id);
  }
}
