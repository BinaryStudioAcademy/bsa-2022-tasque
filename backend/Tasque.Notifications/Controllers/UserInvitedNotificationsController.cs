using Microsoft.AspNetCore.Mvc;
using Tasque.Core.Common.Entities.Notifications;
using Tasque.Notifications.Services;

namespace Tasque.Notifications.Controllers
{
    [Route("api/user-invited-notifications")]
    [ApiController]
    public class UserInvitedNotificationsController : NotificationsController<UserInvitedNotification>
    {
        public UserInvitedNotificationsController(UserInvitedNotificationsService service) : base(service)
        {
        }
    }
}
