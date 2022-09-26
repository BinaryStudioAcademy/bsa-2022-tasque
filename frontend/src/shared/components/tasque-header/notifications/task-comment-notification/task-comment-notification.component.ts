import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Notification } from 'src/core/models/notifications/notification';
import { TaskCommentedNotification } from 'src/core/models/notifications/task-commented-notification';
import { TaskModel } from 'src/core/models/task/task-model';
import { UserModel } from 'src/core/models/user/user-model';

@Component({
  selector: 'task-comment-notification',
  templateUrl: './task-comment-notification.component.html',
  styleUrls: ['./task-comment-notification.component.sass']
})
export class TaskCommentNotificationComponent implements OnInit {

  @Input() notification: TaskCommentedNotification;
  @Output() deleteNotification = new EventEmitter<Notification>();
  commentBy: UserModel = {
    id: -1,
    name: 'Daniil',
    email: 'test@mail.com',
    organizationRoles: [],
    avatarURL: 'https://images.unsplash.com/photo-1541963463532-d68292c34b19?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxleHBsb3JlLWZlZWR8Mnx8fGVufDB8fHx8&w=1000&q=80'
  };
  task: TaskModel = {
    id: -1,
    summary: 'Test',
    order: 1,
    attachments: [],
    typeId: 1,
    createdAt: new Date(),
    updatedAt: new Date(),
    deadline: new Date(),
  };
  comment: string = 'Test';

  constructor() { }

  ngOnInit(): void {
  }

  onDelete(): void {
    this.deleteNotification.emit(this.notification);
  }

  getTaskRef(): void {
    console.log(this.task); //TODO: Implement ability to open task-card by link and redirect to it
  }

}
