import { Component, Input, OnInit } from '@angular/core';
import { TaskInfoModel } from 'src/core/models/board/task-Info-model';
import { OrganizationModel } from 'src/core/models/organization/organization-model';
import { UserModel } from 'src/core/models/user/user-model';
import { UserRole } from 'src/core/models/user/user-roles';
import { GetCurrentOrganizationService } from 'src/core/services/get-current-organization.service';
import { GetCurrentUserService } from 'src/core/services/get-current-user.service';
import { NotificationService } from 'src/core/services/notification.service';
import { OrganizationService } from 'src/core/services/organization.service';
import { TaskService } from 'src/core/services/task-service.service';

@Component({
  selector: 'tasque-card',
  templateUrl: './tasque-card.component.html',
  styleUrls: ['./tasque-card.component.sass']
})
export class TasqueCardComponent implements OnInit {

  //Gets information about the task
  @Input() taskInfo: TaskInfoModel; 
  @Input() isDone: boolean;
  user: UserModel;
  hasAccess: boolean;
  organizationId: number;
  isDeleted = false;

  currentUser: UserModel;
  currentOrganization: OrganizationModel;
  
  assignees: UserModel[];

  constructor(
    private currentUserService: GetCurrentUserService,
    private notificationService: NotificationService,
    private taskService: TaskService,
    private currentOrganizationService: GetCurrentOrganizationService,
    private organizationService: OrganizationService,
  ) { }

  ngOnInit(): void {
    this.user = this.taskInfo.assignees?.[0] as UserModel;
    this.assignees = this.taskInfo.assignees as UserModel[]?? [];
    this.currentUserService.currentUser$.subscribe((user) => {
      this.currentUser = user;
    });
    this.organizationId = this.currentOrganizationService.currentOrganizationId;
    this.organizationService
      .getOrganization(this.organizationId)
      .subscribe((resp) => {
        this.currentOrganization = resp.body as OrganizationModel;
        const role = this.currentUser.organizationRoles.find((r) => r.organizationId === this.organizationId)?.role as UserRole;
        if(role >= UserRole.projectAdmin || 
          this.currentOrganization.authorId === this.currentUser.id) {
          this.hasAccess = true;
        } else {
          this.hasAccess = false;
        }
      });
  }

  deleteTask(): void {
    if(!this.hasAccess) {
      this.notificationService.error('You has not permission to do that', 'Access denied');
      return;
    }
    this.taskService.deleteTask(this.taskInfo.id).subscribe(() => {
      this.notificationService.success('Task has been deleted successfully', 'Success');
      this.isDeleted = true;
    });
  }

  notImplementetNotification(): void {
    this.notificationService.warning('Not implemented yet', 'Warning');
  }

}
