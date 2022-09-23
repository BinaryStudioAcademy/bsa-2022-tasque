import { Injectable } from '@angular/core';
import { BehaviorSubject, ReplaySubject, Subject } from 'rxjs';
import { LocalStorageKeys } from '../models/local-storage-keys';
import { ProjectInfoModel } from '../models/project/project-info-model';

@Injectable({ providedIn: 'root' })
export class GetCurrentProjectService {
    constructor() { }

    private currentProjectIdSubj = new BehaviorSubject<number>(this.currentProjectId);
    public currentProjectId$ = this.currentProjectIdSubj.asObservable();

    public set currentProjectId(value: number) {
        this.currentProjectIdSubj.next(value);
        localStorage.setItem(LocalStorageKeys.selectedProject, value.toString());
    }

    public get currentProjectId(): number {
        return +(localStorage.getItem(LocalStorageKeys.selectedProject) ?? '-1');
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
