using Newtonsoft.Json;
using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities.Notifications
{
    public abstract class Notification : BaseEntity
    {
        public abstract NotificationType Type { get; }
        [JsonIgnore]
        public string ConnectionId { get; set; } = "";
    }

    public enum NotificationType
    {
        TaskMoved,
        TaskCommented,
        UserInvited
    }
}
