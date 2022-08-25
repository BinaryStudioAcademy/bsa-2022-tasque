﻿import { Injectable } from '@angular/core';
import { HttpService } from './http.service';
import { NewProjectModel } from '../models/project/new-project-model';
import { Observable } from 'rxjs';
import { HttpResponse } from '@angular/common/http';
import { ProjectModel } from '../models/project/project-model';
import { EditProjectModel } from '../models/project/edit-project-model';
import { ProjectInfoModel } from '../models/project/project-info-model';

@Injectable({
  providedIn: 'root'
})
export class ProjectService {
  public routePrefix = '/api/project';

  constructor(
    public httpService: HttpService
  ) { }

  createProject(newProject: NewProjectModel): Observable<HttpResponse<ProjectModel>> {
    return this.httpService.postFullRequest<ProjectModel>(this.routePrefix + '/create', newProject);
  }

  editProject(editProject: EditProjectModel): Observable<void> {
    console.log(editProject);
    return this.httpService.putRequest<void>(this.routePrefix + '/edit', editProject);
  }

  getAllProjectsOfThisUser(userId: number): Observable<HttpResponse<ProjectInfoModel[]>> {
    return this.httpService.getFullRequest<ProjectInfoModel[]>(this.routePrefix + `/user/${userId}`);
  } 
}
