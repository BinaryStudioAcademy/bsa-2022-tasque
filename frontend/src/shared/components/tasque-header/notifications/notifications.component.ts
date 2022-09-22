import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Notification } from 'src/core/models/notifications/notification';
import { NotificationType } from 'src/core/models/notifications/notification-type';
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
    console.log(this.notifications);
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

  setToUserInvited(notification: Notification): UserInvitedNotification {
    return notification as UserInvitedNotification;
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
