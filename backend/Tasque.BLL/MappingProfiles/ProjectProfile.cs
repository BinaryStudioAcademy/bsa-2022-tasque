using AutoMapper;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.PartialModels;

namespace Tasque.Core.BLL.MappingProfiles;

public class ProjectProfile : Profile
{
    public ProjectProfile()
    {
        CreateMap<NewProjectDto, Project>();
        CreateMap<Project, ProjectDto>().ReverseMap();
    }
}