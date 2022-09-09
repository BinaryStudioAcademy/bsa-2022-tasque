using AutoMapper;
using Tasque.Core.Common.DTO.Project;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.BLL.MappingProfiles
{
    public class ProjectProfile : Profile
    {
        public ProjectProfile()
        {
            CreateMap<Project, ProjectDto>().ReverseMap();
            CreateMap<Project, ProjectInfoDto>()
                .ForMember(dest => dest.Users, act => act.MapFrom(src => src.UserRoles));

            CreateMap<Project, ProjectAfterCreateDto>();
        }
    }
}
