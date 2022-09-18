using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Messaging
{
    public static class Constants
    {
        public static class Notifications
        {
            public const string Exchange = "Notifications";
            public static class Queues
            {
                public const string TaskMoved = "TaskMoved";
                public const string TaskCommented = "TaskCommented";
                public const string UserInvited = "UserInvited";
            }
        }
    }
}
