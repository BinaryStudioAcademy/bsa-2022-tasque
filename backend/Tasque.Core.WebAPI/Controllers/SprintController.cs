using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Sprint;
using Tasque.Core.Common.Entities;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Controllers;

[Route("api/sprint/")]
public class SprintController : EntityController<Sprint, SprintDto, SprintService>
{
    public SprintController(SprintService service, CurrentUserParameters currentUser)
        : base(service, currentUser)
    {

    }

    [Route("complete/{id}")]
    [HttpPut]
    public async Task<IActionResult> CompleteSprint(int id)
    {
        await _service.CompleteSprint(id);

        return Ok();
    }

    [Route("edit")]
    [HttpPut]
    public virtual async Task<IActionResult> Edit([FromBody] EditSprintDto sprintDto)
    {        
        var entity = await _service.Edit(sprintDto);
        var dto = mapper.Map<SprintDto>(entity);
        return Ok(dto);
    }
}
