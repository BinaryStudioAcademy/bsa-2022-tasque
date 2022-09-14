using Tasque.Core.Common.Entities.Notifications;
using Tasque.Core.Common.Models.Events;
using Tasque.Notifications.Hubs;

namespace Tasque.Notifications.Handlers
{
    public class TaskMovedEventHandler : NotificationsEventHandler<TaskMovedNotification, TaskMovedEvent>
    {
        public TaskMovedEventHandler(NotificationsHub hub) : base(hub)
        { }
    }
}
