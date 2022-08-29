using AutoMapper;
using Tasque.Core.Common.DTO.PartialModels;
using Tasque.Core.Common.DTO.Task;
using Task = Tasque.Core.Common.Entities.Task;

namespace Tasque.Core.BLL.MappingProfiles
{
    public class TaskProfile : Profile
    {
        public TaskProfile()
        {
            CreateMap<Task, TaskDto>().ReverseMap();
            //CreateMap<CreateTaskModel, Task>().ReverseMap();
            CreateMap<TaskCustomFields, CosmosTaskFields>();
        }
    }
}
