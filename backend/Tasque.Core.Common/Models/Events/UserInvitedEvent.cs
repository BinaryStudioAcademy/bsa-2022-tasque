namespace Tasque.Core.Common.Models.Events
{
    public class UserInvitedEvent : IntegrationEvent
    {
        public int ProjectId { get; set; }
        public int InviteeId { get; set; }
    }
}
