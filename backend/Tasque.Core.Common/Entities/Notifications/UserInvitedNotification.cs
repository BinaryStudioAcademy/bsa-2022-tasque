namespace Tasque.Core.Common.Entities.Notifications
{
    public class UserInvitedNotification : Notification
    {
        public override string Type => "UserInvited";
        public int ProjectId { get; set; }
        public int InviteeId { get; set; }
        public int InvitorId { get; set; }
    }
}
