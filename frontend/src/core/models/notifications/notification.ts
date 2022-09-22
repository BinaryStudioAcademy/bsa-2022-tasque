import { NotificationType } from './notification-type';

export interface Notification {
    id: number;
    createdAt: Date,
    type: NotificationType
}