import { Component, OnInit } from '@angular/core';
import { GetCurrentProjectService } from 'src/core/services/get-current-project.service';
import { ProjectInfoModel } from 'src/core/models/project/project-info-model';
import { Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ProjectService } from 'src/core/services/project.service';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';
import { UserModel } from 'src/core/models/user/user-model';
import { GetCurrentOrganizationService } from 'src/core/services/get-current-organization.service';
import { BusinessRole, IUserCard } from '../../select-users/Models';
import { BaseComponent } from 'src/core/base/base.component';

@Component({
  selector: 'tasque-project-dropdown',
  templateUrl: './project-dropdown.component.html',
  styleUrls: ['./project-dropdown.component.sass']
})
export class ProjectDropdownComponent extends BaseComponent implements OnInit {

  public currentUser: UserModel;
  public latestProjects: ProjectInfoModel[] = [];

  private fakeUsers: IUserCard[] = [{
    id: -1,
    email: 'tester@gmail.com',
    userName: 'tester',
    profileURL: '',
    avatarURL: '',
    role: BusinessRole.Dev
  }];

  public currentProject: ProjectInfoModel = {
    id: -1,
    name: 'My Project',
    authorId: -1,
    key: 'S1',
    organizationId: -1,
    users: this.fakeUsers
  };

  constructor(
    private getCurrentProjectService: GetCurrentProjectService,
    private getCurrentUserService: GetCurrentUserService,
    private getCurrentOrganizationService: GetCurrentOrganizationService,
    private projectService: ProjectService,
    private router: Router) {
    super();
  }

  ngOnInit(): void {
    this.subscribeToCurrentUser();
    this.subscribeToCurrentProject();
    this.subscribeToProjectChange();
  }

  public selectProject(project: ProjectInfoModel): void {
    if (this.currentProject.id === project.id &&
      this.getCurrentProjectService.currentProjectId === project.id) {
      return;
    }

    this.getCurrentProjectService.currentProjectId = project.id;

    this.router.navigate([`/project/${project.id}/board`], { 
      replaceUrl: true 
    });
    window.scroll(0, 0);
  }

  public openProjectsPage(): void {
    this.router.navigate(['/projects'], {
      replaceUrl: true,
    });
    window.scroll(0, 0);
  }

  public trackByProject(index: number, project: ProjectInfoModel): number {
    return project.id;
  }

  private setProject(): void {
    if (this.currentProject.id === -1) {
      return;
    }

    this.projectService.getCurrentProjectInfoById(this.getCurrentProjectService.currentProjectId)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe(
        (result) => {
          if (result.body) {
            this.currentProject = result.body;
            this.latestProjects.push(this.currentProject);
          }
        }
      );
  }

  private subscribeToCurrentProject(): void {
    this.getCurrentProjectService.currentProjectId$.subscribe(
      (result) => {
        if (result === -1) {
          this.latestProjects = [];
          this.getCurrentProjectService.setProjects(this.latestProjects);
          return;
        }

        if (this.currentProject.id === result) {
          return;
        }

        const searchedOrganization = this.latestProjects.find((x) => x.id === result);

        if (searchedOrganization) {
          this.currentProject = searchedOrganization;
        }
        else {
          this.setProject();
        }
      });
  }

  private subscribeToProjectChange(): void {
    this.getCurrentProjectService.projectUpdated$.subscribe(
      (project) => {
        if(project) {
          const index = this.latestProjects.findIndex((proj) => proj.id === project.id);
          
          if (index === -1) {
            this.latestProjects.push(project);
  
            if (this.getCurrentProjectService.currentProjectId === -1) {
              this.getCurrentProjectService.currentProjectId = this.latestProjects[0].id;
            }
  
            return;
          }
  
          this.latestProjects[index] = project;
  
          if (this.currentProject.id === project.id) {
            this.currentProject = project;
          }
        }
      }
    );
  }

  public subscribeToCurrentUser(): void {
    this.getCurrentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user;

      this.projectService.getAllProjectsOfThisOrganization(this.getCurrentOrganizationService.currentOrganizationId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((response) => {

          this.latestProjects = response.body as ProjectInfoModel[];

          if (this.latestProjects.length === 0) {
            this.currentProject = {
              id: -1,
              name: 'My Project',
              authorId: -1,
              key: 'S1',
              organizationId: -1,
              users: this.fakeUsers
            };

            this.getCurrentProjectService.setProjects(this.latestProjects);
            return;
          }

          const searchedProject = this.latestProjects
            .find((x) => x.id === this.getCurrentProjectService.currentProjectId);

          if (searchedProject) {
            this.currentProject = searchedProject;

            this.getCurrentProjectService.setProjects(this.latestProjects);
            return;
          }

          if (this.getCurrentProjectService.currentProjectId === -1
            && this.latestProjects.length > 0) {

            this.getCurrentProjectService.currentProjectId = this.latestProjects[0].id;

            this.getCurrentProjectService.setProjects(this.latestProjects);
            return;
          }
        });
    });
  }
}
