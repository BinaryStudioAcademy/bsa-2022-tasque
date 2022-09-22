import { NotificationType } from './notification-type';
import { Notification } from './notification';

export interface TaskCommentedNotification extends Notification {
    type: NotificationType.TaskCommented,
    taskId: number,
    commentId: number
}