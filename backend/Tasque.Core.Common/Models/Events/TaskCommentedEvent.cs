using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Models;
using Task = Tasque.Core.Common.Entities.Task;

namespace Tasque.Notifications.Events
{
    public class TaskCommentedEvent : IntegrationEvent
    {
        public Task Task { get; set; }
        public Comment Comment { get; set; }
        public string CommentatorName { get; set; }
        public string AuthorName { get; set; }
    }
}
