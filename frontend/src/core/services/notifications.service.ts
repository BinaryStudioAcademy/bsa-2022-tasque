import { HttpResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { HubConnection, HubConnectionBuilder } from '@microsoft/signalr';
import { forkJoin, Observable } from 'rxjs';
import { Notification } from '../models/notifications/notification';
import { NotificationType } from '../models/notifications/notification-type';
import { TaskCommentedNotification } from '../models/notifications/task-commented-notification';
import { TaskMovedNotification } from '../models/notifications/task-moved-notification';
import { UserInvitedNotification } from '../models/notifications/user-invited-notification';
import { AuthService } from './auth.service';
import { HttpNotificationsService } from './http-notifications.service';
import { ToastrNotificationService } from './toastr-notification.service';

@Injectable({
  providedIn: 'root'
})
export class NotificationsService {

  constructor(private authSerivce: AuthService, private httpService: HttpNotificationsService, private toastr: ToastrNotificationService) {
    
  }

  buildConnection() : HubConnection {
    const connection = new HubConnectionBuilder().withUrl('https://localhost:6001/notifications').withAutomaticReconnect().build();
    return connection;
  }

  connectToNotificationsEndpoints(hubConnection: HubConnection): void {
    hubConnection.start()
    .then()
    .catch(() => this.toastr.error('Error while establishing connection'));

    hubConnection.on('connected', (connectionId: string) => {
      this.authSerivce.setConnectionId(connectionId)
        .subscribe(() => {});
    });
  }

  getNotificationsOfUser(userId: number): Observable<[HttpResponse<TaskCommentedNotification[]>, HttpResponse<TaskMovedNotification[]>, HttpResponse<UserInvitedNotification[]>]> {
    return forkJoin([
      this.getTaskCommentedNotifications(userId),
      this.getTaskMovedNotifications(userId),
      this.getUserInvitedNotifications(userId)
    ]);
  }

  deleteNotification(notification: Notification): Observable<HttpResponse<void>> {
    let url = '';
    switch (notification.type) {
      case NotificationType.TaskCommented:
        url += 'task-commented-notifications';
        break;
      case NotificationType.TaskMoved:
        url += 'task-moved-notifications';
        break;
      case NotificationType.UserInvited:
        url += 'user-invited-notifications';
    }

    return this.httpService.deleteFullRequest<void>(url + `/delete/${notification.id}`);
  }

  private getUserInvitedNotifications(userId: number): Observable<HttpResponse<UserInvitedNotification[]>> {
    return this.httpService.getFullRequest<UserInvitedNotification[]>(`user-invited-notifications?recieverId=${userId}`);
  }

  private getTaskMovedNotifications(userId: number): Observable<HttpResponse<TaskMovedNotification[]>> {
    return this.httpService.getFullRequest<TaskMovedNotification[]>(`task-moved-notifications?recieverId=${userId}`);
  }

  private getTaskCommentedNotifications(userId: number): Observable<HttpResponse<TaskCommentedNotification[]>> {
    return this.httpService.getFullRequest<TaskCommentedNotification[]>(`task-commented-notifications?recieverId=${userId}`);
  }
}
