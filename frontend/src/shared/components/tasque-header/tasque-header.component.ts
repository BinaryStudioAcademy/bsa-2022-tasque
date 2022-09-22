import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import {
  faCaretDown,
  faCaretUp,
  faMagnifyingGlass,
} from '@fortawesome/free-solid-svg-icons';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { UserModel } from 'src/core/models/user/user-model';
import { AuthService } from 'src/core/services/auth.service';
import { OpenDialogService } from 'src/core/services/open-dialog.service';
import { InternalServices } from 'src/core/services/internalServices';
import { Observable } from 'rxjs';
import { ProjectModel } from 'src/core/models/project/project-model';
import { ProjectService } from 'src/core/services/project.service';
import { concatMap, map } from 'rxjs/operators';
import { GetCurrentOrganizationService } from 'src/core/services/get-current-organization.service';
import { OrganizationService } from 'src/core/services/organization.service';
import { UserRole } from 'src/core/models/user/user-roles';
import { UserProjectRole } from 'src/core/models/user/user-project-roles';
import { BusinessRole } from '../select-users/Models';
import { ScopeGetCurrentEntityService } from 'src/core/services/scope/scopre-get-current-entity.service';

@Component({
  selector: 'tasque-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
})
export class HeaderComponent implements OnInit {
  public searchIcon = faMagnifyingGlass;
  public currentUser: UserModel;
  public currentOrganizationId: number;
  public currentProjectId: number;
  public currentProject: ProjectModel;
  @Input() hasLogo = false;
  @Output() isChanged = new EventEmitter<Observable<void>>();

  public upArrowIcon = faCaretUp;
  public downArrowIcon = faCaretDown;
  public isCurrentUserAdmin = false;
  public isCurrentUserProjectAdmin = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private openDialogService: OpenDialogService,
    private internalServices: InternalServices,
    private projectService: ProjectService,
    private currentOrganizationService: GetCurrentOrganizationService,
    private organizationService: OrganizationService,
    private scopeGetCurrentEntityService: ScopeGetCurrentEntityService,
  ) {}

  ngOnInit(): void {
    this.subscribeToCurrentUser();
    this.subscribeToCurrentOrganization();
    this.subscribeToCurrentUserAvatar();
    this.subscribeToCurrentProject();
  }

  changeOrganizationId(val: number): void {
    this.currentOrganizationId = val;
  }

  private subscribeToCurrentOrganization(): void {
    this.internalServices.getCurrentOrganizationService.currentOrganizationId$.subscribe(
      (result) => {
        this.currentOrganizationId = result;
      },
    );
  }

  public subscribeToCurrentUser(): void {
    this.scopeGetCurrentEntityService.getCurrentUserService.getCurrentUser();

    this.scopeGetCurrentEntityService.getCurrentUserService.currentUser$.subscribe(
      (user) => {
        if (!user) {
          return;
        }
        this.currentUser = user;
        this.scopeGetCurrentEntityService.getCurrentProjectService.currentProjectId$.subscribe(
          (project) => {
            this.currentProjectId = project;

            this.permissionToEdit();
          },
        );
      },
    );
  }

  public subscribeToCurrentUserAvatar(): void {
    this.scopeGetCurrentEntityService.getCurrentUserService.userAvatarUpdated$.subscribe(
      (avatar) => {
        this.currentUser.avatarURL = avatar;
      },
    );
  }

  public subscribeToCurrentProject(): void {
    this.internalServices.getCurrentProjectService.currentProjectId$
      .pipe(
        concatMap((id) => this.projectService.getProjectById(id)),
        map((resp) => resp.body),
      )
      .subscribe((project) => {
        if (!project) {
          return;
        }
        this.currentProject = project;
      });
  }

  openCreateOrganizationDialog(): void {
    this.openDialogService
      .openCreateOrganizationDialog(this.currentUser)
      .subscribe((result: OrganizationModel) => {
        if (!result) {
          return;
        }

        this.internalServices.getCurrentOrganizationService.updateOrganization(
          result,
        );
      });
  }

  public openCreateProjectDialog(): void {
    this.openDialogService
      .openCreateProjectDialog(this.currentOrganizationId)
      .subscribe((result) => {
        if (!result) {
          return;
        }

        this.internalServices.getCurrentProjectService.updateProject(result);
      });
  }

  get currentUserAvatar(): string {
    if (!this.currentUser || !this.currentUser.avatarURL) {
      return '\\assets\\avatar.png';
    }

    return this.currentUser.avatarURL;
  }

  public openProjectsPage(): void {
    this.router.navigate(['/projects'], { replaceUrl: true });
    window.scroll(0, 0);
  }

  public logoutClick(): void {
    this.authService.logout();
  }

  public profileSettingsClick(): void {
    this.router.navigate(['/user/profile'], { replaceUrl: true });
  }

  public checkUrl(): void {
    this.isChanged.emit();
  }

  permissionToEdit(): void {
    const organizationId =
      this.scopeGetCurrentEntityService.getCurrentOrganizationService
        .currentOrganizationId;
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
            r.projectId === this.currentProjectId &&
            r.userId === this.currentUser.id,
        ) as UserProjectRole;

        if (
          projectRole.roleId == BusinessRole.Admin ||
          this.isCurrentUserAdmin
        ) {
          this.isCurrentUserProjectAdmin = true;
        } else {
          this.isCurrentUserProjectAdmin = false;
        }
      });
  }
}
