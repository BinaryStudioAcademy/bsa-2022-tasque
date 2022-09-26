import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Notification } from 'src/core/models/notifications/notification';
import { TaskMovedNotification } from 'src/core/models/notifications/task-moved-notification';

@Component({
  selector: 'task-moved-notification',
  templateUrl: './task-moved-notification.component.html',
  styleUrls: ['./task-moved-notification.component.sass']
})
export class TaskMovedNotificationComponent implements OnInit {

  @Input() notification: TaskMovedNotification;
  @Output() deleteNotification = new EventEmitter<Notification>();
  constructor() { }

  ngOnInit(): void {
  }

  onDelete(): void {
    this.deleteNotification.emit(this.notification);
  }

}
