namespace Tasque.Core.Common.Entities.Notifications
{
    public class UserInvitedNotification : Notification
    {
        public override NotificationType Type => NotificationType.UserInvited;
        public override int RecieverId => InviteeId;
        public int ProjectId { get; set; }
        public int InviteeId { get; set; }
        public int InvitorId { get; set; }
    }
}
