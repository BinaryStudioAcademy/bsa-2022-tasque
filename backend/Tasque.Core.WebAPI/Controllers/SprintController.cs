using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Sprint;
using Tasque.Core.Common.Entities;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Controllers;

[Route("api/sprint")]
public class SprintController : EntityController<Sprint, SprintDto, SprintService>
{
<<<<<<< HEAD
    private readonly SprintService _sprintService;

    public SprintController(SprintService service) : base(service)
=======
    public SprintController(SprintService service, CurrentUserParameters currentUser)
        : base(service, currentUser)
>>>>>>> dev
    {
        _sprintService = service;
    }

    [HttpPut("/complete/{id}")]
    public async Task<IActionResult> CompleteSprint(int id)
    {
        await _sprintService.CompleteSprint(id);

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
