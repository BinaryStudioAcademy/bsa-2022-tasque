using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Project;
using Tasque.Core.Common.DTO.User;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.PartialModels;

namespace Tasque.Core.WebAPI.Controllers;

[Route("api/project/")]
public class ProjectController : EntityController<Project, NewProjectDto, ProjectService>
{
    public ProjectController(ProjectService service) : base(service)
    {
        
    }

    [HttpPut("edit")]
    public async Task<IActionResult> EditProject([FromBody]EditProjectDto editProjectDto)
    {
        await _service.EditProject(editProjectDto);

        return Ok();
    }

    [HttpGet("user/{id}")]
    public async Task<IActionResult> GetAllUserProjects(int id)
    {
        return Ok(await _service.GetAllUserProject(id));
    }

    [HttpPut("invite")]
    public async Task<IActionResult> InviteUserToProject([FromBody]UserInviteDto userInviteDto)
    {
        await _service.InviteUserToProject(userInviteDto);

        return Ok();
    }
}
