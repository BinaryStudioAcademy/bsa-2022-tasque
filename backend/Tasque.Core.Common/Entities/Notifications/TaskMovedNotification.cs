using System;
using System.Collections.Generic;
using System.Linq;
namespace Tasque.Core.Common.Entities.Notifications
{
    public class TaskMovedNotification : Notification
    {
        public override NotificationType Type => NotificationType.TaskMoved;
        public override int RecieverId => TaskAuthorId;
        public int PreviousColumnId { get; set; }
        public int NewColumnId { get; set; }
        public int TaskId { get; set; }
        public int MovedById { get; set; }
        public int TaskAuthorId { get; set; }
    }
}
