using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.Common.Entities.Notifications;
using Tasque.Notifications.Services;

namespace Tasque.Notifications.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskMovedNotificationsController : NotificationsController<TaskMovedNotification>
    {
        public TaskMovedNotificationsController(TaskMovedNotificationsService service) : base(service)
        {
        }
    }
}
