using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.BLL.Services;
using Tasque.Core.BLL.Services.AWS;
using Tasque.Core.Common.DTO.PartialModels;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskController : ControllerBase
    {
        private readonly ITaskService _taskService;
        private readonly IAwsTaskService _awsTaskService;

        public TaskController(ITaskService taskService, IAwsTaskService awsTaskService)
        {
            _taskService = taskService;
            _awsTaskService = awsTaskService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateTask([FromBody] CreateTask task)
        {
            return Ok(await _taskService.CreateTask(task));
        }

        [HttpGet("getAll")]
        public async Task<IActionResult> GetAllTasks()
        {
            return Ok(await _taskService.GetAllTasks());
        }

        [HttpGet("AwsGet")]
        public async Task<IActionResult> GetAllAws()
        {
            var tasks = await _awsTaskService.GetAllTasks();
            return Ok(tasks);
        }

        [HttpPost("AwsPost")]
        public async Task<IActionResult> CreateAws([FromBody] CustomAwsTaskAttributes model)
        {
            var task = await _awsTaskService.CreateTask(model);
            return Created(task.ToString()?? "", task);
        }

        [HttpDelete("AwsDelete")]
        public async Task<IActionResult> DeleteAws(int id, int projectId)
        {
            await _awsTaskService.DeleteTask(id, projectId);
            return NoContent();
        }
        [HttpPut("AwsPut")]
        public async Task<IActionResult> UpdateAws([FromBody] CustomAwsTaskAttributes model)
        {
            return Ok(await _awsTaskService.UpdateTask(model));
        }
        [HttpGet("AwsGetById")]
        public async Task<IActionResult> GetAwsById(int id, int projectId)
        {
            return Ok(await _awsTaskService.GetTaskById(id, projectId));
        }

        [HttpGet("getById")]
        public async Task<IActionResult> GetTaskById(int id)
        {
            var task = await _taskService.GetTasksById(id);
            return Ok(task);
        }

        [HttpDelete]
        public async Task<IActionResult> DeleteTask(int id)
        {
            await _taskService.DeleteTask(id);
            return NoContent();
        }

        [HttpPut]
        public async Task<IActionResult> UpdateTask([FromBody] UpdateTask model)
        {
            var task = await _taskService.UpdateTask(model);
            return Ok(task);
        }
    }
}
