using Microsoft.AspNetCore.Mvc;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;
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
            var data = JsonConvert.SerializeObject(
                await Service.GetNotifications(recieverId),
                new JsonSerializerSettings
                {
                    ContractResolver = new DefaultContractResolver { NamingStrategy = new CamelCaseNamingStrategy() }
                });
            return Ok(data);
        }

        [HttpDelete("delete/{id}")]
        public async Task<IActionResult> DeleteNotification(int id)
        {
            await Service.DeleteNotification(id);
            return Ok();
        }
    }
}
