using Newtonsoft.Json;

namespace Tasque.Core.Common.Entities.Notifications
{
    public class UserInvitedNotification : Notification
    {
        public override NotificationType Type => NotificationType.UserInvited;
        public int ProjectId { get; set; }
        [JsonIgnore]
        public int InviteeId { get; set; }
        public int InvitorId { get; set; }
    }
}
