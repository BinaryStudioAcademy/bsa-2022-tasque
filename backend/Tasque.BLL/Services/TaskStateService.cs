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

        public TaskStateService(DataContext db, IMapper mapper) : base(db)
        {
            this._mapper = mapper;
        }

        public new async Task<IEnumerable<TaskState>> GetAll()
        {
            var tasksStates = await _db.TaskStates
                .ToListAsync();

            return tasksStates;
        }

        public async Task<IEnumerable<TaskStateDto>> GetAllTaskStatesByProjectId(int projectId)
        {
            var taskStates = await _db.TaskStates.Where(t => t.ProjectId == projectId).ToListAsync();

            return _mapper.Map<IEnumerable<TaskStateDto>>(taskStates);
        }
    }
}
