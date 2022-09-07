using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.Entities.Notifications
{
    public class TaskMovedNotification : Notification
    {
        public BoardColumn PreviousColumn { get; set; }
        public BoardColumn NewColumn { get; set; }
        public Task Task { get; set; }
        public string authorName { get; set; }
    }
}
