import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Notification } from 'src/core/models/notifications/notification';
import { NotificationType } from 'src/core/models/notifications/notification-type';
import { TaskCommentedNotification } from 'src/core/models/notifications/task-commented-notification';
import { TaskMovedNotification } from 'src/core/models/notifications/task-moved-notification';
import { UserInvitedNotification } from 'src/core/models/notifications/user-invited-notification';

@Component({
  selector: 'tasque-notifications',
  templateUrl: './notifications.component.html',
  styleUrls: ['./notifications.component.sass']
})
export class NotificationsComponent implements OnInit {
  @Input() notifications: Notification[] = [];
  @Output() deleteNotification = new EventEmitter<Notification>();

  notificationCardHeight = 61;
  maxNotifications = 5;

  constructor() { }

  ngOnInit(): void {
    this.notifications = this.notifications.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  toggleDropdown(): void {
    const dropdown = document.getElementById('notifications-wrapper');
    if (this.notifications.length != 0)
      dropdown?.classList.toggle('hide');
  }

  isUserInvitedNotification(notification: Notification): boolean {
    return notification.type == NotificationType.UserInvited;
  }

  isTaskCommentedNotification(notification: Notification): boolean {
    return notification.type == NotificationType.TaskCommented;
  }

  isTaskMovedNotification(notification: Notification): boolean {
    return notification.type == NotificationType.TaskMoved;
  }

  setToUserInvited(notification: Notification): UserInvitedNotification {
    return notification as UserInvitedNotification;
  }

  setTaskCommented(notification: Notification): TaskCommentedNotification {
    return notification as TaskCommentedNotification;
  }

  setTaskMoved(notification: Notification): TaskMovedNotification {
    return notification as TaskMovedNotification;
  }

  sortNotifications(notifications: Notification[]): Notification[] {
    return notifications.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }

  getDropdownLength(): number {
    return Math.min(this.notifications.length, 5);
  }

  onDelete(notification: Notification): void {
    this.deleteNotification.emit(notification);
  }
}
