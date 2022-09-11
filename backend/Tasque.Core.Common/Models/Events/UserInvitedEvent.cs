using Tasque.Core.Common.Entities;

namespace Tasque.Core.Common.Models.Events
{
    public class UserInvitedEvent : IntegrationEvent
    {
        public int ProjectId { get; set; }
        public string InviteeName { get; set; }
        public string InvitorName { get; set; }
        public int InviteeId { get; set; }
    }
}
