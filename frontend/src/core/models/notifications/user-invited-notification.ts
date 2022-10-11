import { NotificationType } from './notification-type';
import { Notification } from './notification';

export interface UserInvitedNotification extends Notification {
    type: NotificationType.UserInvited,
    projectId: number,
    invitorId: number
}
