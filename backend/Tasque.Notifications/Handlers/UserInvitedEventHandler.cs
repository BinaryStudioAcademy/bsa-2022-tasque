using Tasque.Core.Common.Entities.Notifications;
using Tasque.Core.Common.Models.Events;
using Tasque.Notifications.Hubs;

namespace Tasque.Notifications.Handlers
{
    public class UserInvitedEventHandler : NotificationsEventHandler<UserInvitedNotification, UserInvitedEvent>
    {
        public UserInvitedEventHandler(NotificationsHub hub) : base(hub)
        { }

        public override async Task Handle(UserInvitedEvent @event)
        {
            var notification = _mapper.Map<UserInvitedNotification>(@event);
            await _hub.NotifySingleUser(notification, notification.InviteeId);
        }
    }
}
