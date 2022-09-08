using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.Entities;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/taskType")]
    [ApiController]
    public class TaskTypeController : EntityController<TaskType, TaskTypeDto, TaskTypeService>
    {
        private readonly TaskTypeService _service;
        public TaskTypeController(TaskTypeService service, CurrentUserParameters currentUser) : base(service, currentUser)
        {
            _service = service;
        }

        [HttpGet("getAllByProjectId/{projectId}")]
        public async Task<IActionResult> GetAllTaskTypesByProjectId(int projectId)
        {
            throw new NotImplementedException();
        }

        [HttpGet("getAll")]
        public async Task<IActionResult> GetAll()
        {
            return Ok(await _service.GetAll());
        }

    }
}
