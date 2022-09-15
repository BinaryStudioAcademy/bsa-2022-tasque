using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.BLL.Exeptions;
using Tasque.Core.Common.DTO.Sprint;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.DTO.User;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;
using Task = System.Threading.Tasks.Task;
using Tasque.Core.Common.Models.Task;
using Tasque.Core.BLL.Extensions;
using Tasque.Core.Common.Enums;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.BLL.Services
{
    public class SprintService : EntityCrudService<NewSprintDto, SprintDto, EditSprintDto, int, Sprint>
    {
        public SprintService(DataContext db, IMapper mapper, CurrentUserParameters currentUser) 
            : base(db, mapper, currentUser)
        {

        }

        public override async Task<SprintDto> Create(NewSprintDto sprintDto)
        {
            var sprintAuthor = await _db.Users
                .Include(u => u.Roles)
                .FirstOrDefaultAsync(u => u.Id == sprintDto.AuthorId)
                  ?? throw new ValidationException("User not found");

            var sprintProject = await _db.Projects
                .FirstOrDefaultAsync(u => u.Id == sprintDto.ProjectId)
                  ?? throw new ValidationException("Project not found");

            var newSprint = new Sprint()
            {
                Name = sprintDto.Name,
                ProjectId = sprintDto.ProjectId,
                CreatedAt =  DateTime.UtcNow,
            };
            newSprint.Order = _db.Sprints.Max(x => x.Order) + 1;

            var sprint = _db.Sprints.Add(newSprint).Entity;
            await _db.SaveChangesAsync();

            return _mapper.Map<SprintDto>(sprint);
        }

        public async Task<IEnumerable<SprintDto>> GetProjectSprints(int projectId)
        {
            var sprints = await _db.Sprints
                .Where(s => s.ProjectId == projectId && !s.IsComplete)
                .ToListAsync();

            return _mapper.Map<IEnumerable<SprintDto>>(sprints);
        }
        
        public async Task<IEnumerable<SprintDto>> GetProjectArchiveSprints(int projectId)
        {
            var sprints = await _db.Sprints
                .Where(s => s.ProjectId == projectId && s.IsComplete)
                .ToListAsync();

            return _mapper.Map<IEnumerable<SprintDto>>(sprints);
        }
        
        public async Task<IEnumerable<TaskDto>> GetSprintTasks(int sprintId)
        {
            var tasks = await _db.Tasks
                .Include(t => t.Users)
                .Include(t => t.Author)
                .Include(t => t.Sprint)
                .Include(t => t.LastUpdatedBy)
                .Include(t => t.Priority)
                .Include(t => t.State)
                .Include(t => t.Project)
                .Include(t => t.Type)
                .Where(t => t.SprintId == sprintId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<TaskDto>>(tasks);
        }
        
        public async Task<IEnumerable<UserDto>> GetSprintUsers(int sprintId)
        {
            var users = await _db.Tasks
                .Include(t => t.Users)
                .Where(t => t.SprintId == sprintId)
                .SelectMany(t => t.Users)
                .GroupBy(x => x.Id)
                .Select(x => x.First())
                .ToListAsync();

            return _mapper.Map<IEnumerable<UserDto>>(users);
        }
        
        public override async Task<SprintDto> Update(int key, EditSprintDto dto)
        {
            var entity = await _db.Sprints.FirstOrDefaultAsync(s => s.Id == key)
                ?? throw new ValidationException("Sprint not found");
            entity.Name = dto.Name;
            if (dto.StartAt != null)
            {
                entity.StartAt = DateTime.SpecifyKind((DateTime)dto.StartAt, DateTimeKind.Utc);
            }
            if (dto.EndAt != null)
            {
                entity.EndAt = DateTime.SpecifyKind((DateTime)dto.EndAt, DateTimeKind.Utc);
            }
            entity.Description = dto.Description;
            entity.UpdatedAt = DateTime.UtcNow;

            if (dto.IsStarting && dto.Tasks != null)
            {
                foreach (var taskId in dto.Tasks)
                {
                    var task = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == taskId)
                        ?? throw new ValidationException("Task not found");
                    task.SprintId = key;
                    _db.Tasks.Update(task);
                }
            }

            _db.Sprints.Update(entity);
            await _db.SaveChangesAsync();

            return _mapper.Map<SprintDto>(entity);
        }
        
        public async Task CompleteSprint(int sprintId)
        {
            var sprint = await _db.Sprints
                .Include(s => s.Tasks)
                .FirstOrDefaultAsync(s => s.Id == sprintId);

            if (sprint == null)
                throw new HttpException(System.Net.HttpStatusCode.NotFound, "Sprinter with this ID does not exist");

            sprint.Tasks
                    .Where(t => t.StateId == ((int)BasicTaskStateTypes.ToDo)
                        || t.StateId == ((int)BasicTaskStateTypes.InProgress))
                    .ToList()
                    .ForEach(t =>
                    {
                        t.SprintId = null;
                    });

            sprint.IsComplete = true;

            _db.Update(sprint);
            await _db.SaveChangesAsync();
        }
        
        public async Task<IEnumerable<SprintDto>> OrderSprints(IEnumerable<int> ids)
        {
            var sprints = _db.Sprints.Where(x => ids.Contains(x.Id));
            sprints.SetOrder(ids);
            await _db.SaveChangesAsync();

            var ord = sprints.OrderBy(x => x.Order);
            return _mapper.Map<List<SprintDto>>(ord);
        }
        
        public async Task UpdateTaskEstimate(TaskEstimateUpdate taskEstimateUpdate)
        {
            var sprint = await _db.Sprints
                .FirstOrDefaultAsync(s => s.Id == taskEstimateUpdate.SprintId);

            if (sprint == null)
                throw new HttpException(System.Net.HttpStatusCode.NotFound, "Sprinter with this ID does not exist");

            var task = await _db.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskEstimateUpdate.TaskId);

            if (task == null)
                throw new HttpException(System.Net.HttpStatusCode.NotFound, "Task with this ID does not exist");

            task.Estimate = taskEstimateUpdate.Estimate;

            _db.Update(task);
            await _db.SaveChangesAsync();
        }

        public async Task Delete(int sprintId, int currentUserId)
        {
            var sprint = await _db.Sprints
                .Include(s => s.Tasks)
                .FirstOrDefaultAsync(s => s.Id == sprintId)
                ?? throw new HttpException(System.Net.HttpStatusCode.NotFound, "Sprinter with this ID does not exist");

            var user = await _db.Users
                .Include(u => u.Roles)
                .FirstOrDefaultAsync(u => u.Id == currentUserId)
                 ?? throw new HttpException(System.Net.HttpStatusCode.NotFound, "User not found");

            var userRole = user.Roles
                .FirstOrDefault(r => r.ProjectId == sprint.ProjectId);

            if (userRole == null || userRole.RoleId != (int)BaseProjectRole.Admin)
                throw new HttpException(System.Net.HttpStatusCode.Forbidden, "Access is denied");

            sprint.Tasks
                    .Where(t => t.StateId == ((int)BasicTaskStateTypes.ToDo)
                        || t.StateId == ((int)BasicTaskStateTypes.InProgress))
                    .ToList()
                    .ForEach(t =>
                    {
                        t.SprintId = null;
                    });

            _db.Sprints.Remove(sprint);

            await _db.SaveChangesAsync();
        }
    }
}
