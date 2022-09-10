using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Models;

namespace Tasque.Notifications.Events
{
    public class UserInvitedEvent : IntegrationEvent
    {
        public Project Project { get; set; }
        public string InviteeName { get; set; }
        public string InvitorName { get; set; }
        public int InviteeId { get; set; }
    }
}
