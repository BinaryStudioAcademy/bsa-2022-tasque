using AutoMapper;
using Tasque.Core.Common.Entities.Notifications;
using Tasque.Core.Common.Models.Events;
using Tasque.Messaging.Abstractions;
using Tasque.Notifications.Data;
using Tasque.Notifications.Hubs;

namespace Tasque.Notifications.Handlers
{
    public abstract class NotificationsEventHandler<TNotification, TEvent> : IIntegrationEventHandler<TEvent>
        where TNotification : Notification
        where TEvent : IntegrationEvent
    {
        protected IMapper _mapper;
        protected NotificationsHub _hub;
        protected IServiceProvider _provider;

        public NotificationsEventHandler(NotificationsHub hub, IServiceProvider provider)
        {
            _provider = provider;
            _hub = hub;
            var config = new MapperConfiguration(cfg => cfg.CreateMap<TEvent, TNotification>()
                .ForMember(e => e.Id, options => options.Ignore()));
            _mapper = config.CreateMapper();
        }

        public virtual Task Handle(TEvent @event)
        {
            var notification = _mapper.Map<TNotification>(@event);

            using var scope = _provider.CreateScope();
            var _db = scope.ServiceProvider.GetRequiredService<NotificationsContext>();
            _db.Add(notification);
            _db.SaveChanges();

            return _hub.NotifySingleUser(notification, notification.RecieverId);
        }
    }
}
