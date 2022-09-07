using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.Entities;
using Tasque.Core.Identity.Helpers;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TaskStateController : EntityController<TaskState, TaskStateDto, TaskStateService>
    {
        public TaskStateController(TaskStateService service, CurrentUserParameters currentUser) : base(service, currentUser)
        {

        }
    }
}
