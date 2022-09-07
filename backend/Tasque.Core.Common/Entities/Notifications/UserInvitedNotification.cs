using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.Entities.Notifications
{
    public class UserInvitedNotification : Notification
    {
        public Project Project { get; set; }
        public string InviteeName { get; set; }
        public string InvitorName { get; set; }
    }
}
