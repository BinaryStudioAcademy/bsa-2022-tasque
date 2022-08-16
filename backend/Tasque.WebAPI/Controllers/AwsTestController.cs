using Amazon.S3;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AwsTestController : ControllerBase
    {
        private readonly AwsTaskService _awsService;

        public AwsTestController(AwsTaskService awsService)
        {
            _awsService = awsService;
        }

        [HttpPost("post")]
        public async Task<IActionResult> CreateTask([FromBody] Common.Entities.Task task)
        {
            return Ok(task);
        }
    }
}
