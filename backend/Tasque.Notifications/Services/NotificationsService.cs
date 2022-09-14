using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.Entities.Notifications;
using Tasque.Notifications.Data;

namespace Tasque.Notifications.Services
{
    public class NotificationsService<TNotification> where TNotification : Notification
    {
        private NotificationsContext _db;
        public NotificationsService(NotificationsContext db)
        {
            _db = db;
        }

        public Task<List<TNotification>> GetNotifications(int recieverId)
        {
            return _db.Set<TNotification>().Where(n => n.RecieverId == recieverId).ToListAsync();
        }
    }
}
