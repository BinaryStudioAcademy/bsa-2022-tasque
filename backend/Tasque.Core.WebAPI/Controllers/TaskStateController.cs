using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.Entities;
using Tasque.Core.Identity.Helpers;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/taskState")]
    [ApiController]
    [Authorize]
    public class TaskStateController : EntityController<TaskStateEditDto, TaskStateDto, TaskStateEditDto, int, TaskStateService>
    {

        public TaskStateController(TaskStateService service) : base(service)
        {

        }

        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAll());
        }

        [HttpGet("getAllByProjectId/{projectId}")]
        public async Task<IActionResult> GetAllTaskStatesByProjectId(int projectId)
        {
            var types = await _service.GetAllTaskStatesByProjectId(projectId);
            if (types == null)
                return NotFound();
            return Ok(types);
        }
    }
}
