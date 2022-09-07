using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Entities.Notifications;

namespace Tasque.Notifications.Hubs
{
    public class TaskCommentedHub : NotificationsHub<TaskCommentedNotification>
    {
        public override string Name => "TaskCommented";
    }
}
