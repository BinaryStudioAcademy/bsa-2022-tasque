using AutoMapper;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.Entities;
using Task = Tasque.Core.Common.Entities.Task;

namespace Tasque.Core.BLL.MappingProfiles
{
    public class TaskProfiles : Profile
    {
        public TaskProfiles()
        {
            CreateMap<Task, TaskDto>().ReverseMap();
        }
    }
}
