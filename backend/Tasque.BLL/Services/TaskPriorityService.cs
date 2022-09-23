using AutoMapper;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.BLL.Services
{
    public class TaskPriorityService : EntityCrudService<TaskPriorityEditDto, TaskPriorityDto, TaskPriorityEditDto, int, TaskPriority>
    {
        public TaskPriorityService(DataContext db, IMapper mapper, CurrentUserParameters currentUser) 
            : base(db, mapper, currentUser)
        {

        }
    }
}
