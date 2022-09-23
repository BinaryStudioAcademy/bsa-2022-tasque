using Microsoft.AspNetCore.Mvc;
using Tasque.Core.Common.Entities.Notifications;
using Tasque.Notifications.Services;

namespace Tasque.Notifications.Controllers
{
    [Route("task-commented")]
    [ApiController]
    public class TaskCommentedNotificationsController : NotificationsController<TaskCommentedNotification>
    {
        public TaskCommentedNotificationsController(TaskCommentedNotificationsService service) : base(service)
        {
        }
    }
}
