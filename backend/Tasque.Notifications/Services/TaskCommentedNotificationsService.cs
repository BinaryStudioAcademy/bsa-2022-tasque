using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.Entities.Notifications;
using Tasque.Notifications.Data;

namespace Tasque.Notifications.Services
{
    public class TaskCommentedNotificationsService : NotificationsService<TaskCommentedNotification>
    {
        public TaskCommentedNotificationsService(NotificationsContext db) : base(db)
        {
        }

        public override Task<List<TaskCommentedNotification>> GetNotifications(int recieverId)
        {
            return _db.TaskCommentedNotifications.Where(n => n.TaskAuthorId == recieverId).ToListAsync();
        }
    }
}
