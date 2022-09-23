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

        public Task<List<TaskState>> GetAll()
        {
            var tasksStates = _db.TaskStates
                .ToListAsync();

            return tasksStates;
        }

        public async Task<IEnumerable<TaskStateDto>> GetAllTaskStatesByProjectId(int projectId)
        {
            var taskStates = await _db.TaskStates.Where(t => t.ProjectId == projectId).ToListAsync();

            return _mapper.Map<IEnumerable<TaskStateDto>>(taskStates);
        }

        public TaskStateDto CreateTaskState(TaskStateDto model)
        {
            var entity = _mapper.Map<TaskState>(model);
            _db.TaskStates.Add(entity);
            _db.SaveChanges();
            return _mapper.Map<TaskStateDto>(entity);
        }

        public async Task<TaskStateDto> UpdateTaskStateStatus(int taskId)
        {
            var taskState = await _db.TaskStates.FirstOrDefaultAsync(t => t.Id == taskId);

            if (taskState != null)
            {
                if (taskState.Status == null)
                {
                    taskState.Status = true;
                }
                else
                {
                    taskState.Status = !taskState.Status;
                }
            }

            _db.Update(taskState);
            await _db.SaveChangesAsync();

            return _mapper.Map<TaskStateDto>(taskState);
        }
    }
}
 