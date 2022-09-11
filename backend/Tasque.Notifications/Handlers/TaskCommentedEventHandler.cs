using Tasque.Core.Common.Entities.Notifications;
using Tasque.Core.Common.Models.Events;
using Tasque.Notifications.Hubs;

namespace Tasque.Notifications.Handlers
{
    public class TaskCommentedEventHandler : NotificationsEventHandler<TaskCommentedNotification, TaskCommentedEvent>
    {
        public TaskCommentedEventHandler(NotificationsHub hub) : base(hub)
        { }

        public override async Task Handle(TaskCommentedEvent @event)
        {
            var notification = _mapper.Map<TaskCommentedNotification>(@event);
            await _hub.NotifySingleUser(notification, notification.TaskAuthorId);
        }
    }
}
