using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.Entities.Notifications;

namespace Tasque.Notifications.Data
{
    public class NotificationsContext : DbContext
    {
        public NotificationsContext(DbContextOptions<NotificationsContext> options) : base(options) { }

        public DbSet<UserInvitedNotification> UserInvitedNotifications { get; set; }
        public DbSet<TaskCommentedNotification> TaskCommentedNotifications { get; set; }
        public DbSet<TaskMovedNotification> TaskMovedNotifications { get; set; }
    }
}
