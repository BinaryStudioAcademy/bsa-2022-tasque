using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.Entities.Notifications;
using Tasque.Notifications.Data;

namespace Tasque.Notifications.Services
{
    public class TaskMovedNotificationsService : NotificationsService<TaskMovedNotification>
    {
        public TaskMovedNotificationsService(NotificationsContext db) : base(db)
        {
        }

        public override Task<List<TaskMovedNotification>> GetNotifications(int recieverId)
        {
            return _db.TaskMovedNotifications.Where(n => n.TaskAuthorId == recieverId).ToListAsync();
        }
    }
}
