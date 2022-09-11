using Tasque.Core.Common.Entities;
using Task = Tasque.Core.Common.Entities.Task;

namespace Tasque.Core.Common.Models.Events
{
    public class TaskCommentedEvent : IntegrationEvent
    {
        public int TaskId { get; set; }
        public int CommentId { get; set; }
        public string CommentatorName { get; set; }
        public string AuthorName { get; set; }
    }
}
