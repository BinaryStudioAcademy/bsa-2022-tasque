import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { ProjectInfoModel } from 'src/core/models/project/project-info-model';
import { ActivatedRoute, Router } from '@angular/router';
import { takeUntil } from 'rxjs/operators';
import { ProjectService } from 'src/core/services/project.service';
import { UserModel } from 'src/core/models/user/user-model';
import { BusinessRole, IUserCard } from '../../select-users/Models';
import { BaseComponent } from 'src/core/base/base.component';
import { ProjectModel } from 'src/core/models/project/project-model';
import { ScopeGetCurrentEntityService } from 'src/core/services/scope/scopre-get-current-entity.service';

@Component({
  selector: 'tasque-project-dropdown',
  templateUrl: './project-dropdown.component.html',
  styleUrls: ['./project-dropdown.component.sass']
})
export class ProjectDropdownComponent extends BaseComponent implements OnInit, OnChanges {

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

  @Input() organizationId: number;

  constructor(
    private getCurrentEntityService: ScopeGetCurrentEntityService,
    private projectService: ProjectService,
    private router: Router,
    private activeRoute: ActivatedRoute) {
    super();
  }

  ngOnInit(): void {
    this.subscribeToCurrentUser();
    this.subscribeToCurrentProject();
    this.subscribeToProjectChange();
  }

  ngOnChanges(): void {
    this.currentProject.name = 'My Project';
    this.currentProject.id = -1;
    this.projectService
      .getProjectsByOrganizationId(this.organizationId)
      .subscribe((resp) => {
        const projects = resp.body as ProjectModel[];
        this.latestProjects = [];
        projects.forEach((p) => {
          this.latestProjects.push({
            id: p.id,
            name: p.name,
            authorId: p.authorId,
            key: p.key as string,
            organizationId: p.organizationId,
          });
        });
    });
    this.subscribeToProjectChange();
  }

  public selectProject(project: ProjectInfoModel): void {
    if (this.currentProject.id === project.id &&
      this.getCurrentEntityService
      .getCurrentProjectService.currentProjectId === project.id) {
      return;
    }

    this.getCurrentEntityService
    .getCurrentProjectService.currentProjectId = project.id;

    this.router.navigateByUrl(`/project/${project.id}`, { skipLocationChange: true }).then(() =>
    this.router.navigate([`./board`], { 
      replaceUrl: true,
      relativeTo: this.activeRoute
    }));
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

    this.projectService.getCurrentProjectInfoById(this.getCurrentEntityService
      .getCurrentProjectService.currentProjectId)
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
    this.getCurrentEntityService
    .getCurrentProjectService.currentProjectId$.subscribe(
      (result) => {
        if (result === -1) {
          this.latestProjects = [];
          this.getCurrentEntityService
          .getCurrentProjectService.setProjects(this.latestProjects);
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
    this.getCurrentEntityService
    .getCurrentProjectService.projectUpdated$.subscribe(
      (project) => {
        if(project) {
          const index = this.latestProjects.findIndex((proj) => proj.id === project.id);
          
          if (index === -1) {
            this.latestProjects.push(project);
  
            if (this.getCurrentEntityService
              .getCurrentProjectService.currentProjectId === -1) {
              this.getCurrentEntityService
              .getCurrentProjectService.currentProjectId = this.latestProjects[0].id;
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
    this.getCurrentEntityService
    .getCurrentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user;

      this.projectService.getAllProjectsOfThisOrganization(this.getCurrentEntityService
        .getCurrentOrganizationService.currentOrganizationId)
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

            this.getCurrentEntityService
            .getCurrentProjectService.setProjects(this.latestProjects);
            return;
          }

          const searchedProject = this.latestProjects
            .find((x) => x.id === this.getCurrentEntityService
            .getCurrentProjectService.currentProjectId);

          if (searchedProject) {
            this.currentProject = searchedProject;

            this.getCurrentEntityService
            .getCurrentProjectService.setProjects(this.latestProjects);
            return;
          }

          if (this.getCurrentEntityService
            .getCurrentProjectService.currentProjectId === -1
            && this.latestProjects.length > 0) {

            this.getCurrentEntityService
            .getCurrentProjectService.currentProjectId = this.latestProjects[0].id;

            this.getCurrentEntityService
            .getCurrentProjectService.setProjects(this.latestProjects);
            return;
          }
        });
    });
  }
}
