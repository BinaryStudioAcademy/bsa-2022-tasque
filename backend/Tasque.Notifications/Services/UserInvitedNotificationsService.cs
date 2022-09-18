using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.Entities.Notifications;
using Tasque.Notifications.Data;

namespace Tasque.Notifications.Services
{
    public class UserInvitedNotificationsService : NotificationsService<UserInvitedNotification>
    {
        public UserInvitedNotificationsService(NotificationsContext db) : base(db)
        {
        }

        public override Task<List<UserInvitedNotification>> GetNotifications(int recieverId)
        {
            return _db.UserInvitedNotifications.Where(n => n.InviteeId == recieverId).ToListAsync();
        }
    }
}
