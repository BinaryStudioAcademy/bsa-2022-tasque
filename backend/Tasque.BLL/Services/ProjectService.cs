using AutoMapper;
using Tasque.Core.Common.DTO.Project;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services;

public class ProjectService : EntityCrudService<Project>
{
    private readonly IMapper _mapper;
    public ProjectService(DataContext db, IMapper mapper) : base(db)
    {
        _mapper = mapper;
    }

    public List<ProjectDto> GetProjectsByOrganizationId(int organizationId)
    {
        var projects = _mapper.Map<List<ProjectDto>>(_db.Projects.Where(p => p.OrganizationId == organizationId));
        return projects;
    }
}
