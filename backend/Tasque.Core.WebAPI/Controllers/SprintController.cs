using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.WebAPI.Controllers;

[Route("api/sprint")]
public class SprintController : EntityController<Sprint, SprintDto, SprintService>
{
    public SprintController(SprintService service) : base(service)
    {
        
    }

    [Route("getSprintsByProjectId/{id}")]
    [HttpGet]
    public async virtual Task<IActionResult> GetUserOrganizationsById(int id)
    {
        var sprints = await _service.GetProjectSprints(id);

        if (sprints is not null)
        {
            return Ok(sprints);
        }
        else
        {
            return BadRequest("Entities not found");
        }
    }
}
