import { Notification } from './notification';
import { NotificationType } from './notification-type';

export interface TaskMovedNotification extends Notification {
    type: NotificationType.TaskMoved,
    taskId: number,
    previousColumnId: number,
    newColumnId: number,
    movedById: number
}
