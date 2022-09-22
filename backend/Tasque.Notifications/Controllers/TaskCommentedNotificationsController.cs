using Microsoft.AspNetCore.Mvc;
using Tasque.Core.Common.Entities.Notifications;
using Tasque.Notifications.Services;

namespace Tasque.Notifications.Controllers
{
    [Route("api/task-commented-notifications")]
    [ApiController]
    public class TaskCommentedNotificationsController : NotificationsController<TaskCommentedNotification>
    {
        public TaskCommentedNotificationsController(TaskCommentedNotificationsService service) : base(service)
        {
        }
    }
}
