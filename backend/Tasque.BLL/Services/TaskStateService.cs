using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services
{
    public class TaskStateService : EntityCrudService<TaskState>
    {
        private readonly IMapper _mapper;

        public TaskStateService(DataContext db) : base(db)
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
