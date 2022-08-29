using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO.Project;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.WebAPI.Controllers;

[Route("api/project")]
public class ProjectController : EntityController<Project, NewProjectDto, ProjectService>
{
    public ProjectController(ProjectService service) : base(service)
    {

    }
}
