using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.Entities.Notifications
{
    public class TaskCommentedNotification : Notification
    {
        public Task Task { get; set; }
        public Comment Comment { get; set; }
        public string CommentatorName { get; set; }
        public string AuthorName { get; set; }
    }
}
