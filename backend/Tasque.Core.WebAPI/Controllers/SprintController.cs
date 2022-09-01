using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Sprint;
using Tasque.Core.Common.Entities;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Controllers;

[Route("api/sprint")]
public class SprintController : EntityController<Sprint, SprintDto, SprintService>
{
    public SprintController(SprintService service, CurrentUserParameters currentUser)
        : base(service, currentUser)
    {
            return BadRequest("Entities not found");
        }
    }
        
    }

    [Route("edit")]
    [HttpPut]
    public virtual async Task<IActionResult> Edit([FromBody] EditSprintDto sprintDto)
    {        
        var entity = await _service.Edit(sprintDto);
        var dto = mapper.Map<SprintDto>(entity);
        return Ok(dto);
    }

    [Route("getSprintsByProjectId/{id}")]
    [HttpGet]
    public async virtual Task<IActionResult> GetSprintsByProjectId(int id)
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

    [Route("{id}/tasks")]
    [HttpGet]
    public async virtual Task<IActionResult> GetSprintTasks(int id)
    {
        var tasks = await _service.GetSprintTasks(id);

        if (tasks is not null)
        {
            return Ok(tasks);
        }
        else
        {
            return BadRequest("Entities not found");
        }
    }

    [Route("{id}/users")]
    [HttpGet]
    public async virtual Task<IActionResult> GetSprintUsers(int id)
    {
        var tasks = await _service.GetSprintUsers(id);

        if (tasks is not null)
        {
            return Ok(tasks);
        }
        else
        {
            return BadRequest("Entities not found");
        }
    }
}
