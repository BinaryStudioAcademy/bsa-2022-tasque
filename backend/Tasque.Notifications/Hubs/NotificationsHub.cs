using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Tasque.Core.Common.Entities.Notifications;
using Task = System.Threading.Tasks.Task;

namespace Tasque.Notifications.Hubs
{
    public class NotificationsHub : Hub
    {
        public async Task NotifySingleUser<TNotification>(TNotification notification, int userId) where TNotification : Notification
        {
            await Clients.User(userId.ToString()).SendAsync(notification.Type.ToString(), JsonConvert.SerializeObject(notification));
        }
    }
}