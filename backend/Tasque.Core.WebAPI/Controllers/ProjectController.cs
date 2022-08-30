using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Project;
using Tasque.Core.Common.Entities;
using Tasque.Core.Identity.Exeptions;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Controllers;

[Route("api/project")]
public class ProjectController : EntityController<Project, NewProjectDto, ProjectService>
{
    private readonly CurrentUserParameters _currentUser;

    public ProjectController(ProjectService service, CurrentUserParameters currentUser) : base(service)
    {
        _currentUser = currentUser;
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
            AuthorId = int.Parse(_currentUser.Id ?? throw new InvalidTokenException("Invalid access token"))
        };

        _service.Create(entity);
        return Ok(entity);
    }
}
