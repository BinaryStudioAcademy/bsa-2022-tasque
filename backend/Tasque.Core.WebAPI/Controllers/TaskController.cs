using Tasque.Core.Common.DTO.Task;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/task")]
    public class TaskController : EntityController<Common.Entities.Task, TaskDto, TaskService>
    {
        public TaskController(TaskService service, CurrentUserParameters currentUser)
            : base(service, currentUser) { }

    }
}
