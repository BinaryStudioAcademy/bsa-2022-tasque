using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.BLL.Services
{
    public class TaskTypeService : EntityCrudService<TaskPriorityEditDto, TaskTypeDto, TaskPriorityEditDto, int, TaskState>
    {   
        public TaskTypeService(DataContext db, IMapper mapper, CurrentUserParameters currentUser) 
            : base(db, mapper, currentUser)
        {

        }

        public List<TaskTypeDto> GetAllTaskTypesByProjectId(int projectId)
        {
            return _mapper.Map<List<TaskTypeDto>>(_db.TaskTypes.Where(t => t.ProjectId == projectId));
        }

        public new async Task<IEnumerable<TaskType>> GetAll()
        {
            var tasksTypes = await _db.TaskTypes
                .ToListAsync();

            return tasksTypes;
        }
    }
}
