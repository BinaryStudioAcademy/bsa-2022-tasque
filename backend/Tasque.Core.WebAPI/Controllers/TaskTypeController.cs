using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.Entities;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/taskType")]
    [ApiController]
    [Authorize]
    public class TaskTypeController : EntityController<TaskType, TaskTypeDto, TaskTypeService>
    {
        private readonly TaskTypeService _service;
        public TaskTypeController(TaskTypeService service, CurrentUserParameters currentUser) : base(service, currentUser)
        {
            _service = service;
        }

        [HttpGet("getAllByProjectId/{projectId}")]
        public IActionResult GetAllTaskTypesByProjectId(int projectId)
        {
            var types = _service.GetAllTaskTypesByProjectId(projectId);
            if (types == null)
                return NotFound();
            return Ok(types);
        }

        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAll());
        }

    }
}
