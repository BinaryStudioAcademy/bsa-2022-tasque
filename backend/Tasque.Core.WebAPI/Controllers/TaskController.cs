using Tasque.Core.Common.DTO.Task;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Identity.Helpers;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/task")]
    public class TaskController : EntityController<Common.Entities.Task, TaskDto, TaskService>
    {
        public TaskController(TaskService service, CurrentUserParameters currentUser)
            : base(service, currentUser) { }

        [HttpGet("getTasksState")]
        public async Task<IActionResult> GetTasksState()
        {
            return Ok(await _service.GetTasksState());
        }

        [HttpGet("getTasksType")]
        public async Task<IActionResult> GetTasksType()
        {
            return Ok(await _service.GetTasksType());
        }
    }
}
