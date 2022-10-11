import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { UserService } from 'src/app/user/services/user.service';
import { Notification } from 'src/core/models/notifications/notification';
import { TaskMovedNotification } from 'src/core/models/notifications/task-moved-notification';
import { TaskModel } from 'src/core/models/task/task-model';
import { UserModel } from 'src/core/models/user/user-model';
import { TaskService } from 'src/core/services/task.service';

@Component({
  selector: 'task-moved-notification',
  templateUrl: './task-moved-notification.component.html',
  styleUrls: ['./task-moved-notification.component.sass']
})
export class TaskMovedNotificationComponent implements OnInit {

  @Input() notification: TaskMovedNotification;
  @Output() deleteNotification = new EventEmitter<Notification>();
  display = false;
  movedBy: UserModel;
  task: TaskModel;
  ref = '';

  constructor(
    private taskService: TaskService,
    private userService: UserService,
  ) { }

  ngOnInit(): void {
    this.taskService.getTaskById(this.notification.taskId).subscribe((resp) => {
      this.task = resp.body as TaskModel;
      this.getRef();
      this.userService.getUserById(this.notification.movedById).subscribe((resp) => {
        this.movedBy = resp.body as UserModel;
        this.display = true;
      });
    });
  }

  onDelete(): void {
    this.deleteNotification.emit(this.notification);
  }

  getRef(): void {
    this.ref = `/project/${this.task.projectId}`;
  }
}
