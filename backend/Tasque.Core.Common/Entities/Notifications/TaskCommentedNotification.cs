namespace Tasque.Core.Common.Entities.Notifications
{
    public class TaskCommentedNotification : Notification
    {
        public override string Type => "TaskCommented";
        public int TaskId { get; set; }
        public int TaskAuthorId { get; set; }
        public int CommentId { get; set; }
    }
}
