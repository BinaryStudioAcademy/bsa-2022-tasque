using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.Entities.Notifications;
using Tasque.Notifications.Data;

namespace Tasque.Notifications.Services
{
    public abstract class NotificationsService<TNotification> where TNotification : Notification
    {
        protected NotificationsContext _db;
        public NotificationsService(NotificationsContext db)
        {
            _db = db;
        }

        public abstract Task<List<TNotification>> GetNotifications(int recieverId);
    }
}
