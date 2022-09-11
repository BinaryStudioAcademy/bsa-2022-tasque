namespace Tasque.Core.Common.Entities.Notifications
{
    public class UserInvitedNotification : Notification
    {
        public override string Type => "UserInvited";
        public int ProjectId { get; set; }
        public string InviteeName { get; set; }
        public string InvitorName { get; set; }
    }
}
