using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.WebAPI.Controllers;

[Route("api/sprint")]
public class SprintController : EntityController<Sprint, SprintDto, SprintService>
{
    private readonly SprintService _sprintService;

    public SprintController(SprintService service) : base(service)
    {
        _sprintService = service;
    }

    [HttpPut("/complete/{id}")]
    public async Task<IActionResult> CompleteSprint(int id)
    {
        await _sprintService.CompleteSprint(id);

        return Ok();
    }
}
