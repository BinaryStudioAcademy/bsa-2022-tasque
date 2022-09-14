using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class TaskPriorityController : EntityController<TaskPriorityEditDto, TaskPriorityDto, TaskPriorityEditDto, int, TaskPriorityService>
    {
        public TaskPriorityController(TaskPriorityService service) : base(service)
        {

        }
    }
}
