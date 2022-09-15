using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Identity.Helpers;


namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/backlog")]
    public class BacklogController : ControllerBase
    {
        private BacklogService _service;
        private readonly int _userId;

        public BacklogController(BacklogService service, CurrentUserParameters currentUser)
        {
            _service = service;
            _userId = currentUser.Id;
        }

        [HttpGet("backlogTasks/{projectId}")]
        public async Task<IActionResult> GetBacklogTasks(int projectId)
        {
            return Ok(await _service.GetBacklogTasks(projectId));
        }

    }
}
