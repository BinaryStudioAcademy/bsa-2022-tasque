using Microsoft.AspNetCore.Mvc;
using Tasque.Core.Common.Entities.Notifications;
using Tasque.Notifications.Services;

namespace Tasque.Notifications.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public abstract class NotificationsController<TNotification> : ControllerBase where TNotification : Notification
    {
        protected NotificationsService<TNotification> Service { get; }
        public NotificationsController(NotificationsService<TNotification> service)
        {
            Service = service;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll(int recieverId)
        {
            return Ok(await Service.GetNotifications(recieverId));
        }
    }
}
