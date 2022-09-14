using Microsoft.AspNetCore.Mvc;
using Tasque.Core.Common.Entities.Notifications;
using Tasque.Notifications.Services;

namespace Tasque.Notifications.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskCommentedNotificationsController : NotificationsController<TaskCommentedNotification>
    {
        public TaskCommentedNotificationsController(NotificationsService<TaskCommentedNotification> service) : base(service)
        {
        }
    }
}
