import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { ProjectModel } from 'src/core/models/project/project-model';
import { UserModel } from 'src/core/models/user/user-model';
import { UserRole } from 'src/core/models/user/user-roles';
import { ProjectService } from 'src/core/services/project.service';
import { takeUntil } from 'rxjs/operators';
import { BaseComponent } from 'src/core/base/base.component';
import { ActivatedRoute, Router } from '@angular/router';
import { Observable } from 'rxjs';
import { faChevronRight } from '@fortawesome/free-solid-svg-icons';
import { OrganizationService } from 'src/core/services/organization.service';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { UserProjectRole } from 'src/core/models/user/user-project-roles';
import { BusinessRole } from '../select-users/Models';
import { ScopeGetCurrentEntityService } from 'src/core/services/scope/scopre-get-current-entity.service';

@Component({
  selector: 'app-left-sidebar',
  templateUrl: './left-sidebar.component.html',
  styleUrls: ['./left-sidebar.component.sass'],
})
export class LeftSidebarComponent
  extends BaseComponent
  implements OnInit, OnChanges {
  public projectId: number;
  public project: ProjectModel;

  public currentUser: UserModel;
  public userRole: UserRole;

  public containerWidth: number;

  public sideBarMinimized: boolean;
  public showSettings = false;

  public isCurrentUserAdmin = false;
  public isCurrentUserProjectAdmin = false;

  @Input() isChanged: Observable<void>;

  isBoard = false;
  isBacklog = false;
  isTeam = false;
  isWiki = false;
  isSettings = false;
  isIssueTemplate = false;
  isBasicSettings = false;

  arrowRight = faChevronRight;

  constructor(
    private breakpointObserver: BreakpointObserver,
    private route: ActivatedRoute,
    private router: Router,
    private projectService: ProjectService,
    private organizationService: OrganizationService,
    private currentService: ScopeGetCurrentEntityService
  ) {
    super();
  }

  ngOnInit(): void {
    this.getProject();
    this.checkActivatedRoute();

    this.breakpointObserver
      .observe(['(max-width: 1200px)'])
      .subscribe((state: BreakpointState) => {
        if (state.matches) {
          this.containerWidth = 127;
          this.sideBarMinimized = true;
        } else {
          this.containerWidth = 252;
          this.sideBarMinimized = false;
        }
    });

    this.currentService
    .getCurrentProjectService.leftSidebar$.subscribe((data) => {
      this.setAllStylesUndefined();
      this.isBacklog = data;
    });
  }

  ngOnChanges(): void {
    this.checkActivatedRoute();
    const id = this.route.snapshot.paramMap.get('id');
    this.projectId = parseInt(id as string);
  }

  minimize(): void {
    this.sideBarMinimized = !this.sideBarMinimized;
    if (this.sideBarMinimized) {
      this.containerWidth = 127;
      return;
    }
    this.containerWidth = 252;
  }

  public getProject(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectId = parseInt(id);

      this.projectService
        .getProjectById(this.projectId)
        .pipe(takeUntil(this.unsubscribe$))
        .subscribe((resp) => {
          this.project = resp.body as ProjectModel;
          this.subsribeToCurrentUser();
        });
    }
  }

  public subsribeToCurrentUser(): void {
    this.currentService.getCurrentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user;
      this.userRole =
        this.currentUser.organizationRoles.find(
          (r) => r.organizationId === this.project.organizationId,
        )?.role ?? UserRole.projectMember;

      this.permissionToEdit();
    });
  }

  navigateToIssueTemplate(): void {
    this.router.navigate([
      'project/' + this.projectId + '/settings/issue-template',
    ]);
    this.setAllStylesUndefined();
    this.isSettings = true;
    this.isIssueTemplate = true;
  }

  navigateToBasicSettings(): void {
    this.router.navigate([
      'project/' + this.projectId + '/settings/basic-settings',
    ]);
    this.setAllStylesUndefined();
    this.isSettings = true;
    this.isBasicSettings = true;
  }

  navigateToBoard(): void {
    this.router.navigate(['project/' + this.projectId + '/board']);
    this.setAllStylesUndefined();
    this.isBoard = true;
  }

  navigateToBacklog(): void {
    this.router.navigate(['project/' + this.projectId + '/backlog']);
    this.setAllStylesUndefined();
    this.isBacklog = true;
  }

  navigateToTeam(): void {
    this.router.navigate(['project/' + this.projectId + '/team']);
    this.setAllStylesUndefined();
    this.isTeam = true;
  }

  navigateToWiki(): void {
    this.router.navigate(['project/' + this.projectId + '/wiki']);
    this.setAllStylesUndefined();
    this.isWiki = true;
  }

  public toggleSettings(): void {
    this.showSettings = !this.showSettings;
  }

  public hideSettings(): void {
    if (this.showSettings) {
      this.showSettings = false;
    }
  }

  public isProjectAdmin(): boolean {
    return (
      this.userRole >= 3 || this.project?.authorId === this.currentUser?.id
    );
  }

  checkActivatedRoute(): void {
    this.setAllStylesUndefined();

    const currentUrl = this.router.url.split('/');

    if (currentUrl.includes('settings')) {
      this.showSettings = true;
      switch (currentUrl[currentUrl.length - 1]) {
        case 'issue-template':
          this.isSettings = true;
          this.isIssueTemplate = true;
          return;
        case 'basic-settings':
          this.isSettings = true;
          this.isBasicSettings = true;
          return;
      }
    }

    switch (currentUrl[currentUrl.length - 1]) {
      case 'board':
        this.isBoard = true;
        return;
      case 'backlog':
        this.isBacklog = true;
        return;
      case 'team':
        this.isTeam = true;
        return;
      case 'wiki':
        this.isWiki = true;
        return;
    }
  }

  setAllStylesUndefined(): void {
    this.isBacklog = false;
    this.isBoard = false;
    this.isSettings = false;
    this.isTeam = false;
    this.isWiki = false;
    this.isIssueTemplate = false;
    this.isBasicSettings = false;
  }

  permissionToEdit(): void {
    const organizationId =
      this.currentService.getCurrentOrganizationService.currentOrganizationId;
    this.organizationService
      .getOrganization(organizationId)
      .subscribe((resp) => {
        const currentOrganization = resp.body as OrganizationModel;
        const role = this.currentUser.organizationRoles.find(
          (r) =>
            r.organizationId === organizationId &&
            r.userId === this.currentUser.id,
        )?.role as UserRole;
        if (
          role >= UserRole.projectAdmin ||
          currentOrganization.authorId === this.currentUser.id
        ) {
          this.isCurrentUserAdmin = true;
        } else {
          this.isCurrentUserAdmin = false;
        }

        const projectRole = this.currentUser.roles?.find(
          (r) =>
            r.projectId === this.project.id && r.userId === this.currentUser.id,
        ) as UserProjectRole;

        if (projectRole) {
          if (
            projectRole.roleId == BusinessRole.Admin ||
            this.isCurrentUserAdmin
          ) {
            this.isCurrentUserProjectAdmin = true;
          } else {
            this.isCurrentUserProjectAdmin = false;
          }
        }
      });
  }
}
