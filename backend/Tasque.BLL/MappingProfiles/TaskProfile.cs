using AutoMapper;
using Tasque.Core.Common.DTO.PartialModels;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.Entities;
using Task = Tasque.Core.Common.Entities.Task;

namespace Tasque.Core.BLL.MappingProfiles
{
    public class TaskProfile : Profile
    {
        public TaskProfile()
        {
            CreateMap<Task, TaskDto>().ReverseMap();
            CreateMap<TaskTypeDto, TaskTypeDto>().ReverseMap();
            CreateMap<TaskPriorityDto, TaskPriorityDto>().ReverseMap();
            CreateMap<TaskState, TaskStateDto>().ReverseMap();
        }
    }
}
