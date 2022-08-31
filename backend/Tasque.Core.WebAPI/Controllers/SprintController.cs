using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.Entities;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Controllers;

[Route("api/sprint")]
public class SprintController : EntityController<Sprint, SprintDto, SprintService>
{
    public SprintController(SprintService service, CurrentUserParameters currentUser)
        : base(service, currentUser)
    {
        
    }
}
