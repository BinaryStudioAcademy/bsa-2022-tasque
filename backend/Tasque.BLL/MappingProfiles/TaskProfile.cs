using AutoMapper;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.DTO.PartialModels;
using Task = Tasque.Core.Common.Entities.Task;

namespace Tasque.Core.BLL.MappingProfiles
{
    public class TaskProfile : Profile
    {
        public TaskProfile()
        {
            CreateMap<Task, TaskDto>().ReverseMap();
            CreateMap<CreateTask, Task>().ReverseMap();
            CreateMap<CustomTaskAttributes, CustomAwsTaskAttributes>();
        }
    }
}
