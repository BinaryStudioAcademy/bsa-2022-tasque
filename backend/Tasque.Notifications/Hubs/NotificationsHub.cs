using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Entities.Notifications;
using Task = System.Threading.Tasks.Task;

namespace Tasque.Notifications.Hubs
{
    public abstract class NotificationsHub<TNotification> : Hub where TNotification : Notification
    {
        public abstract string Name { get; }

        public async Task NotifySingleUser(TNotification notification, int userId)
        {
            await Clients.User(userId.ToString()).SendAsync(Name, JsonConvert.SerializeObject(notification));
        }
    }
}