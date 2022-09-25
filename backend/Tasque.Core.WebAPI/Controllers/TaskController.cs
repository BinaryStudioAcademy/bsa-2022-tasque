using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/task")]
    [ApiController]
    [Authorize]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;
        protected readonly CurrentUserParameters _currentUser;

        public TaskController(ITaskService taskService, CurrentUserParameters currentUser)
        {
            _taskService = taskService;
            _currentUser = currentUser;
        }

        [HttpGet("getAllProjectTasks/{projectId}")]
        public async Task<IActionResult> GetAllProjectTasks(int projectId)
        {
            var tasks = await _taskService.GetAllProjectTasks(projectId);
            if (tasks == null)
                return NotFound("Project or it's tasks not found");
            return Ok(tasks);
        }

        [HttpGet("getAllSprintTasks/{sprintId}")]
        public async Task<IActionResult> GetAllSprintTasks(int sprintId)
        {
            var tasks = await _taskService.GetAllSprintTasks(sprintId);
            if (tasks == null)
                return NotFound("Sprint or it's tasks not found");
            return Ok(tasks);
        }

        [HttpGet("backlogTasks/{projectId}")]
        public async Task<IActionResult> GetAllBacklogTasks(int projectId)
        {
            var tasks = await _taskService.GetAllBacklogTasks(projectId);
            if (tasks == null)
                return NotFound("Tasks not found");
            return Ok(tasks);
        }

        [HttpGet("{id}")]
        public async Task<IActionResult> GetTaskById(int id)
        {
            return Ok(await _taskService.GetTaskById(id));
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] TaskDto model)
        {
            var task = await _taskService.CreateTask(model);
            return Created(task.ToString() ?? "", task);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateTask([FromBody] TaskDto model)
        {
            model.LastUpdatedById = _currentUser.Id;
            return Ok(await _taskService.UpdateTask(model));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            await _taskService.DeleteTask(id);
            return NoContent();
        }

        [HttpPost("order")]
        public async Task<IActionResult> OrderTasks(IEnumerable<int> ids)
        {
            var res = await _taskService.SetOrder(ids);
            return Ok(res);
        }

        [HttpGet("customFields/{id}")]
        public async Task<IActionResult> GetTaskCustomFieldsById(int id)
        {
            return Ok(await _taskService.GetTaskCustomFieldsById(id));
        }
    }
}
