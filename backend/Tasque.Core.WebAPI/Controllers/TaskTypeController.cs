using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.Entities;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskTypeController : EntityController<TaskType, TaskTypeDto, TaskTypeService>
    {
        public TaskTypeController(TaskTypeService service, CurrentUserParameters currentUser) : base(service, currentUser)
        {
        }

        [HttpGet("getAllByProjectId/{projectId}")]
        public async Task<IActionResult> GetAllTaskTypesByProjectId(int projectId)
        {
            throw new NotImplementedException();
        }
    }
}
