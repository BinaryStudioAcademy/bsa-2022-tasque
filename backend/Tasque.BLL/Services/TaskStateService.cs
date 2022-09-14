using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.BLL.Services
{
    public class TaskStateService : EntityCrudService<TaskStateEditDto, TaskStateDto, TaskStateEditDto, int, TaskState>
    {

        public TaskStateService(DataContext db, IMapper mapper, CurrentUserParameters currentUser) 
            : base(db, mapper, currentUser)
        {

        }

        public async Task<IEnumerable<TaskState>> GetAll()
        {
            var tasksStates = await _db.TaskStates
                .ToListAsync();

            return tasksStates;
        }
    }
}
