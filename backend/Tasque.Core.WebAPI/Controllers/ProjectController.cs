using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.PartialModels;

namespace Tasque.Core.WebAPI.Controllers;

[Route("api/project")]
public class ProjectController : EntityController<Project, NewProjectDto, ProjectService>
{
    public ProjectController(ProjectService service) : base(service)
    {
        
    }
}
