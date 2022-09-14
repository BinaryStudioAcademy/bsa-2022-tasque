using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO.Task;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/task")]
    [ApiController]
    [Authorize]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;

        public TaskController(ITaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpGet("getAllTasks")]
        public async Task<IActionResult> GetAllTasks()
        {
            return Ok(await _taskService.GetAllTasks());
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
            return Created(task.ToString()?? "", task);
        }

        [HttpPut]
        public async Task<IActionResult> UpdateTask([FromBody] TaskDto model)
        {
            return Ok(await _taskService.UpdateTask(model));
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteTask(int id)
        {
            await _taskService.DeleteTask(id);
            return NoContent();
        }

        [HttpGet("getTasksState")]
        public async Task<IActionResult> GetTasksState()
        {
            return Ok();
         //   return Ok(await _taskService.GetTasksState());
        }

        [HttpGet("getTasksType")]
        public async Task<IActionResult> GetTasksType()
        {
            return Ok();
            //   return Ok(await _taskService.GetTasksType());
        }
    }
}
