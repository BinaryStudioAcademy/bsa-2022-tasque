using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.BLL.Services;
using Tasque.Core.BLL.Services.AWS;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AwsTestController : ControllerBase
    {
        private readonly IAwsTaskService _awsService;
        private readonly ITaskService _taskService;

        public AwsTestController(IAwsTaskService awsService, ITaskService taskService)
        {
            _awsService = awsService;
            _taskService = taskService;
        }

        [HttpPost("post")]
        public async Task<IActionResult> CreateTask([FromBody] Common.Entities.Task task)
        {
            return Ok(task);
        }

        [HttpGet("get")]
        public async Task<IActionResult> GetAllTasks()
        {
            return Ok(await _taskService.GetAllTasks());
        }
    }
}
