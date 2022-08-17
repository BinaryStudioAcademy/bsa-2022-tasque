using AutoMapper;
using Tasque.Core.Common.DTO;

namespace Tasque.Core.BLL.MappingProfiles
{
    public class TaskProfile : Profile
    {
        public TaskProfile()
        {
            CreateMap<Task, TaskDto>().ReverseMap();
        }
    }
}
