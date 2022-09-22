using Microsoft.AspNetCore.SignalR;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
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

        public Task NotifySingleUser(Notification notification)
        {
            return _context.Clients.Client(notification.ConnectionId).SendAsync("UserInvited",
                JsonConvert.SerializeObject(notification,
                new JsonSerializerSettings
                {
                    ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() }
                })
            );
        }

        public override Task OnConnectedAsync()
        {
            base.OnConnectedAsync();
            Clients.Client(Context.ConnectionId).SendAsync("connected", Context.ConnectionId);
            return Task.CompletedTask;
        }
    }
}