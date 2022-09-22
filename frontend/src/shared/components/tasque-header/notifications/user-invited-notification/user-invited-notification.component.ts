import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { faCross } from '@fortawesome/free-solid-svg-icons';
import { UserService } from 'src/app/user/services/user.service';
import { Notification } from 'src/core/models/notifications/notification';
import { UserInvitedNotification } from 'src/core/models/notifications/user-invited-notification';
import { ProjectModel } from 'src/core/models/project/project-model';
import { UserModel } from 'src/core/models/user/user-model';
import { ProjectService } from 'src/core/services/project.service';
import { ToastrNotificationService } from 'src/core/services/toastr-notification.service';

@Component({
  selector: 'user-invited-notification',
  templateUrl: './user-invited-notification.component.html',
  styleUrls: ['./user-invited-notification.component.sass']
})
export class UserInvitedNotificationComponent implements OnInit {
  @Input() notification: UserInvitedNotification;
  @Output() deleteNotification = new EventEmitter<Notification>();
  project: ProjectModel;
  invitedBy: UserModel;

  projectLoaded = false;
  userLoaded = false;
  crossIcon = faCross;

  constructor(private projectService: ProjectService, private userService: UserService, private toastr: ToastrNotificationService) { }

  ngOnInit(): void {
    this.projectService.getProjectById(this.notification.projectId)
    .subscribe((response) => {
      if (response.ok && response.body) {
        this.project = response.body;
        this.projectLoaded = true;
      }
      else {
        this.toastr.error('Error while fetching data of a notification');
      }
    });

    this.userService.getUserById(this.notification.invitorId)
    .subscribe((response) => {
      if (response.ok && response.body) {
        this.invitedBy = response.body;
        this.userLoaded = true;
      }
      else {
        this.toastr.error('Error while fetching data of a notification');
      }
    });
  }

  onDelete(): void {
    this.deleteNotification.emit(this.notification);
  }

  // TODO redirect to 'open' page of a project
  getProjectRef(): string {
    return `project/${this.project.id}/board`;
  }
}
