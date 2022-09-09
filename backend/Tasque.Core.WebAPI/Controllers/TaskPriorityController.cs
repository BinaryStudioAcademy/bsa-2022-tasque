using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.Entities;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TaskPriorityController : EntityController<TaskPriority, TaskPriorityDto, TaskPriorityService>
    {
        public TaskPriorityController(TaskPriorityService service, CurrentUserParameters currentUser) : base(service, currentUser)
        {

        }
    }
}
