using AutoMapper;
using Tasque.Core.Common.DTO.Board;
using Tasque.Core.Common.DTO.Project;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.BLL.MappingProfiles
{
    public class ProjectProfile : Profile
    {
        public ProjectProfile()
        {
            CreateMap<Project, ProjectInfoDto>()
                .ForMember(dest => dest.Users, act => act.MapFrom(src => src.UserRoles));

            CreateMap<Project, ProjectAfterCreateDto>();

            CreateMap<Project, BoardInfoDto>();
        }
    }
}
