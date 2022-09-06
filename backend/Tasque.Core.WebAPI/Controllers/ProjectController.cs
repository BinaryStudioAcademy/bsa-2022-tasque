using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Project;
using Tasque.Core.Common.DTO.User;
using Tasque.Core.Common.Entities;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Controllers;

[Route("api/project")]
public class ProjectController : EntityController<Project, NewProjectDto, ProjectService>
{
    public ProjectController(ProjectService service, CurrentUserParameters currentUser, IMapper mapper) 
        : base(service, currentUser, mapper)
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

    [HttpGet("team/{id:int}")]
    public async Task<IActionResult> GetTeamMembers(int id)
    {
        var users = await _service.GetProjectTeam(id);
        // TODO: Add roles to dto and update mapping profile
        var res = diMapper.Map<IEnumerable<UserDto>>(users);
        return Ok(res);
    }
}
