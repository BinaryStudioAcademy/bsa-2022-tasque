using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Project;
using Tasque.Core.Common.Entities;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Controllers;

[Route("api/project")]
public class ProjectController : EntityController<Project, NewProjectDto, ProjectService>
{
    public ProjectController(ProjectService service, CurrentUserParameters currentUser) 
        : base(service, currentUser)
    {
        
    }

    [Route("create")]
    [HttpPost]
    public override IActionResult Create([FromBody] NewProjectDto entityDTO)
    {
        var entity = new Project()
        {
            Name = entityDTO.Name,
            Key = entityDTO.Key,
            OrganizationId = entityDTO.OrganizationId,
            AuthorId = _currentUser.Id
        };

        _service.Create(entity);
        return Ok(entity);
    }

    [HttpPost("invite")]
    public async Task<IActionResult> InviteUser([FromBody] InviteUserDTO dto)
    {
        var invited = await _service.InviteUser(dto);
        if (invited)
        {
            return Ok();
        }
        return BadRequest("User was not found or has not confirmed its account yet");
    }
}
