import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Notification } from 'src/core/models/notifications/notification';
import { TaskCommentedNotification } from 'src/core/models/notifications/task-commented-notification';

@Component({
  selector: 'task-comment-notification',
  templateUrl: './task-comment-notification.component.html',
  styleUrls: ['./task-comment-notification.component.sass']
})
export class TaskCommentNotificationComponent implements OnInit {

  @Input() notification: TaskCommentedNotification;
  @Output() deleteNotification = new EventEmitter<Notification>();
  constructor() { }

  ngOnInit(): void {
  }

  onDelete(): void {
    this.deleteNotification.emit(this.notification);
  }

}
