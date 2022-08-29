using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskPriorityController : EntityController<TaskPriority, TaskPriorityDto, TaskPriorityService>
    {
        public TaskPriorityController(TaskPriorityService service) : base(service)
        {

        }
    }
}
