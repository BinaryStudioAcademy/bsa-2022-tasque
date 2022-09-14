using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities.Notifications
{
    public abstract class Notification : BaseEntity
    {
        public abstract NotificationType Type { get; }
        public abstract int RecieverId { get; }
    }

    public enum NotificationType
    {
        TaskMoved,
        TaskCommented,
        UserInvited
    }
}
