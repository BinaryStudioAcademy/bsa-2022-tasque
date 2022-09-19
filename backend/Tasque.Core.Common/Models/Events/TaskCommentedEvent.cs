namespace Tasque.Core.Common.Models.Events
{
    public class TaskCommentedEvent : IntegrationEvent
    {
        public int TaskId { get; set; }
        public int TaskAuthorId { get; set; }
        public int CommentId { get; set; }
    }
}
