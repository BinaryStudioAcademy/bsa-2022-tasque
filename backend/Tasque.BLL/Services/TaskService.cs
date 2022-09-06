using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;
using Task = Tasque.Core.Common.Entities.Task;

namespace Tasque.Core.BLL.Services
{
    public class TaskService : EntityCrudService<Task>
    {
        private IMapper _mapper;
        public TaskService(DataContext context, IMapper mapper) : base(context)
        {
            _mapper = mapper;
        }

        public async Task<IEnumerable<TaskState>> GetTasksState()
        {
            var tasksState = await _db.TaskStates
                .Select(s => s)
                .ToListAsync();

            return _mapper.Map<IEnumerable<TaskState>>(tasksState);
        }

        public async Task<IEnumerable<TaskType>> GetTasksType()
        {
            var tasksType = await _db.TaskTypes
                .Select(s => s)
                .ToListAsync();

            return _mapper.Map<IEnumerable<TaskType>>(tasksType);
        }

    }
}
