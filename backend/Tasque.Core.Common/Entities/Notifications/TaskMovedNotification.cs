using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.Entities.Notifications
{
    public class TaskMovedNotification : Notification
    {
        public override string Type => "TaskMoved";
        public int PreviousColumnId { get; set; }
        public int NewColumnId { get; set; }
        public int TaskId { get; set; }
        public int MovedById { get; set; }
        public int TaskAuthorId { get; set; }
    }
}
