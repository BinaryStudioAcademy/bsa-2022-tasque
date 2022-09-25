import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { take } from 'rxjs/operators';
import { LocalStorageKeys } from '../models/local-storage-keys';
import { ProjectInfoModel } from '../models/project/project-info-model';
import { ProjectModel } from '../models/project/project-model';
import { ProjectService } from './project.service';

@Injectable({ providedIn: 'root' })
export class GetCurrentProjectService {
    constructor(
        private projectService: ProjectService,
    ) { }

    private currentProjectIdSubj = new BehaviorSubject<number>(this.currentProjectId);
    private currentProjectSubj = new ReplaySubject<ProjectModel>(1);

    public currentProject$ = this.currentProjectSubj.asObservable();
    public currentProjectId$ = this.currentProjectIdSubj.asObservable();

    public set currentProjectId(value: number) {
        this.currentProjectIdSubj.next(value);
        localStorage.setItem(LocalStorageKeys.selectedProject, value.toString());
    }

    public get currentProjectId(): number {
        return +(localStorage.getItem(LocalStorageKeys.selectedProject) ?? '-1');
    }

    public getCurrentProject(): void {
        this.projectService.getProjectById(this.currentProjectId)
        .pipe(take(1))
        .subscribe((resp) => {
            if(resp.body) {
                this.setCurrentProject(resp.body as ProjectModel);
            }
        });
    }

    public setCurrentProject(value: ProjectModel): void {
        this.currentProjectSubj.next(value);
    }

    public clearCurrentProjectId(): void {
        this.currentProjectIdSubj.next(-1);
        this.currentProjectIdSubj.complete();
        this.currentProjectIdSubj = new BehaviorSubject<number>(this.currentProjectId);
        this.currentProjectId$ = this.currentProjectIdSubj.asObservable();
    }

    private projectUpdatedSubj = new Subject<ProjectInfoModel>();
    public projectUpdated$ = this.projectUpdatedSubj.asObservable();

    public updateProject(project: ProjectInfoModel): void {
        this.projectUpdatedSubj.next(project);
    }

    private projectsSubj = new ReplaySubject<ProjectInfoModel[]>(1);
    public projects$ = this.projectsSubj.asObservable();

    public setProjects(projects: ProjectInfoModel[]): void {
        this.projectsSubj.next(projects);
    }

    private leftSidebarSubj = new Subject<boolean>();
    public leftSidebar$ = this.leftSidebarSubj.asObservable();

    public setLeftSidebar(value: boolean): void {
        this.leftSidebarSubj.next(value);
    }
}
