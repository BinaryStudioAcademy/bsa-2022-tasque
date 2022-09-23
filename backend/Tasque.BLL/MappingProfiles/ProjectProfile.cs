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
            CreateMap<Project, ProjectDto>().ReverseMap();
            CreateMap<NewProjectDto, Project>();
            CreateMap<EditProjectDto, Project>();
            CreateMap<Project, ProjectInfoDto>()
                .ForMember(dest => dest.Users, act => act.MapFrom(src => src.UserRoles));

            CreateMap<Project, BoardInfoDto>();
            CreateMap<BoardInfoDto, Project>()
                .ForMember(x => x.Users, opt => opt.Ignore())
                .AfterMap((dto, project) =>
                {
                    foreach (var column in project.Columns)
                    {
                        column.ProjectId = dto.Id;
                        foreach (var task in column.Tasks)
                        {
                            task.ProjectId = dto.Id;
                            task.BoardColumnId = column.Id;
                        }
                    }
                });
        }
    }
}
