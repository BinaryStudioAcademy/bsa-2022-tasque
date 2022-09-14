using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Tasque.Core.Common.Entities.Notifications;
using Task = System.Threading.Tasks.Task;

namespace Tasque.Notifications.Hubs
{
    public class NotificationsHub : Hub
    {
        protected IHubContext<NotificationsHub> _context;
        public NotificationsHub(IHubContext<NotificationsHub> context)
        {
            _context=context;
        }

        public Task NotifySingleUser(Notification notification, int userId)
        {
            return _context.Clients.User(userId.ToString()).SendAsync(notification.Type.ToString(), JsonConvert.SerializeObject(notification));
        }
    }
}