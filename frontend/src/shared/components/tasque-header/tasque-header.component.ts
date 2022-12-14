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
import { OrganizationService } from 'src/core/services/organization.service';
import { UserRole } from 'src/core/models/user/user-roles';
import { UserProjectRole } from 'src/core/models/user/user-project-roles';
import { BusinessRole } from '../select-users/Models';
import { ScopeGetCurrentEntityService } from 'src/core/services/scope/scopre-get-current-entity.service';
import { NotificationsService } from 'src/core/services/notifications.service';
import { Methods } from 'src/core/models/notifications/Constants';
import { Notification } from 'src/core/models/notifications/notification';
import { UserInvitedNotification } from 'src/core/models/notifications/user-invited-notification';
import { ToastrNotificationService } from 'src/core/services/toastr-notification.service';

@Component({
  selector: 'tasque-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.sass'],
})
export class HeaderComponent implements OnInit {
  public notifications: Notification[] = [];
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

  private notificationSound = new Audio('assets/notification_sound.wav');
  private notificationDeleteSound = new Audio('assets/notification_delete.wav');

  // eslint-disable-next-line
  constructor(
    private authService: AuthService,
    private router: Router,
    private openDialogService: OpenDialogService,
    private internalServices: InternalServices,
    private projectService: ProjectService,
    private organizationService: OrganizationService,
    private scopeGetCurrentEntityService: ScopeGetCurrentEntityService,
    private notificationsService: NotificationsService,
    private toastrNotificationsService: ToastrNotificationService,
  ) {}

  ngOnInit(): void {
    this.subscribeToCurrentUser();
    this.subscribeToCurrentOrganization();
    this.subscribeToCurrentUserAvatar();
    this.subscribeToCurrentProject();

    const connection = this.notificationsService.buildConnection();
    this.notificationsService.connectToNotificationsEndpoints(connection);

    // TODO add functionality here
    // connection.on(Methods.taskCommented, (notification: TaskCommentedNotification) => {});
    // connection.on(Methods.taskMoved, (notification: TaskMovedNotification) => {});
    connection.on(Methods.userInvited, (jsonNotification: string) => {
      const notification = JSON.parse(
        jsonNotification,
      ) as UserInvitedNotification;
      this.notifications.push(notification);
      this.notificationSound.play();
    });
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

        this.notificationsService
          .getNotificationsOfUser(this.currentUser.id)
          .subscribe((result) => {
            if (result.some((resp) => !resp.ok)) {
              this.toastrNotificationsService.error(
                'Notifications cannot be fetched',
              );
              return;
            }

            result.map((resp) => {
              const notifications = resp.body as Notification[];
              this.notifications.push(...notifications);
            });
          });
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
        concatMap((id) => {
          if (id > 0) {
            return this.projectService.getProjectById(id);
          }
          return [];
        }),
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

  public onDeleteNotification(notification: Notification): void {
    this.notificationsService
      .deleteNotification(notification)
      .subscribe((resp) => {
        if (resp.ok) {
          this.notifications.splice(
            this.notifications.indexOf(notification),
            1,
          );
          this.notificationDeleteSound.play();
        } else {
          this.toastrNotificationsService.error(
            'Error while deleting notification',
          );
        }
      });
  }
}
