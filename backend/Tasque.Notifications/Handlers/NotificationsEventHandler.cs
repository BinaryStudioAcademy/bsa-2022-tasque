using AutoMapper;
using Tasque.Core.Common.Entities.Notifications;
using Tasque.Core.Common.Models.Events;
using Tasque.Messaging.Abstractions;
using Tasque.Notifications.Hubs;

namespace Tasque.Notifications.Handlers
{
    public abstract class NotificationsEventHandler<TNotification, TEvent> : IIntegrationEventHandler<TEvent>
        where TNotification : Notification
        where TEvent : IntegrationEvent
    {
        protected IMapper _mapper;
        protected NotificationsHub _hub;

        public NotificationsEventHandler(NotificationsHub hub)
        {
            _hub = hub;
            var config = new MapperConfiguration(cfg => cfg.CreateMap<TEvent, TNotification>());
            _mapper = config.CreateMapper();
        }

        public async virtual Task Handle(TEvent @event)
        {
            var notification = _mapper.Map<TNotification>(@event);
            await _hub.NotifySingleUser(notification, notification.RecieverId);
        }
    }
}
