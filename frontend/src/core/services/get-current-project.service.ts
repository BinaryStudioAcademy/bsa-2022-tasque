import { Injectable } from '@angular/core';
import { ReplaySubject } from 'rxjs';
import { ProjectInfoModel } from '../models/project/project-info-model';

@Injectable({ providedIn: 'root' })
export class GetCurrentProjectService {
    constructor() { }

    private currentProjectSubj = new ReplaySubject<ProjectInfoModel>(1);
    public currentProject$ = this.currentProjectSubj.asObservable();

    public setCurrentProject(project: ProjectInfoModel): void {
        this.currentProjectSubj.next(project);
    }

    private projectsSubj = new ReplaySubject<ProjectInfoModel>(3);
    public projects$ = this.projectsSubj.asObservable();

    public setProjects(project: ProjectInfoModel): void {
        this.projectsSubj.next(project);
    }
}
