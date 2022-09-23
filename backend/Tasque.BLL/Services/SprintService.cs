using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.BLL.Exeptions;
using Tasque.Core.BLL.Extensions;
using Tasque.Core.Common.DTO.Sprint;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.DTO.User;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Enums;
using Tasque.Core.Common.Models.Task;
using Tasque.Core.DAL;
using Tasque.Core.Identity.Helpers;
using Task = System.Threading.Tasks.Task;

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

            int order;
            try
            {
                order = _db.Sprints.Max(x => x.Order);
            }
            catch
            {
                order = 0;
            }

            var newSprint = new Sprint()
            {
                Name = sprintDto.Name,
                ProjectId = sprintDto.ProjectId,
                CreatedAt = DateTime.UtcNow,
                Order = order + 1,
            };

            await _db.Sprints.AddAsync(newSprint);
            await _db.SaveChangesAsync();

            return _mapper.Map<SprintDto>(newSprint);
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
                //Before starting a sprint,
                //we check whether there are no already started sprints in the project

                var activeSprints = await _db.Sprints
                    .Where(s => s.StartAt != null
                                && !s.IsComplete
                                && s.ProjectId == entity.ProjectId
                                && s.Id != entity.Id)
                    .ToListAsync();

                if (activeSprints.Count > 0)
                    throw new ValidationException(
                        "You can edit dates when sprint will be active");

                entity.StartAt = DateTime.SpecifyKind((DateTime)dto.StartAt, DateTimeKind.Utc);
            }

            if (dto.StartAt.ToString() == string.Empty)
            {
                entity.StartAt = null;
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

        public async Task<SprintDto> UpdateOrder(SprintDto dto)
        {
            var entity = await _db.Sprints.FirstOrDefaultAsync(s => s.Id == dto.Id)
                ?? throw new ValidationException("Sprint not found");

            var sprints = await _db.Sprints
                .Where(s => !s.IsComplete && s.ProjectId == dto.ProjectId)
                .OrderBy(s => s.Order)
                .ToListAsync();

            if (dto.Order < entity.Order)
            {
                //sprint up
                int firstSprintOrder = 0;
                var firstSprint = sprints
                    .LastOrDefault(s => s.Order < entity.Order);

                if (firstSprint != null)
                {
                    if (firstSprint.StartAt != null)
                        throw new HttpException(System.Net.HttpStatusCode.Forbidden, "Complete the pre-sprint first!");


                    firstSprintOrder = firstSprint.Order;
                    firstSprint.Order = entity.Order;

                    _db.Sprints.Update(firstSprint);
                }
                else
                {
                    firstSprintOrder = _db.Sprints.Max(x => x.Order) - 1;
                }

                entity.Order = firstSprintOrder;

            }
            else if (dto.Order > entity.Order)
            {
                //sprint down
                int lastSprintOrder = 0;
                var lastSprint = sprints
                   .FirstOrDefault(s => s.Order > entity.Order);

                if (lastSprint != null)
                {
                    lastSprintOrder = lastSprint.Order;
                    lastSprint.Order = entity.Order;

                    _db.Sprints.Update(lastSprint);
                }
                else
                {
                    lastSprintOrder = _db.Sprints.Max(x => x.Order) + 1;
                }

                entity.Order = lastSprintOrder;
            }


            _db.Sprints.Update(entity);
            await _db.SaveChangesAsync();

            return _mapper.Map<SprintDto>(entity);
        }

        public async Task CompleteSprint(int sprintId)
        {
            var sprint = await _db.Sprints
                .Include(s => s.Tasks)
                    .ThenInclude(t => t.State)
                .FirstOrDefaultAsync(s => s.Id == sprintId);

            if (sprint == null)
                throw new HttpException(System.Net.HttpStatusCode.NotFound, "Sprinter with this ID does not exist");

            sprint.Tasks
                    .Where(t => t.State?.Status == null || t.State?.Status == false)
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

            var task = await _db.Tasks
                .FirstOrDefaultAsync(t => t.Id == taskEstimateUpdate.TaskId);

            if (task == null)
                throw new HttpException(System.Net.HttpStatusCode.NotFound, "Task with this ID does not exist");

            task.Estimate = taskEstimateUpdate.Estimate;

            _db.Update(task);
            await _db.SaveChangesAsync();
        }

        public override async Task<bool> Delete(int sprintId)
        {
            var sprint = await _db.Sprints
                .Include(s => s.Tasks)
                    .ThenInclude(t => t.State)
                .FirstOrDefaultAsync(s => s.Id == sprintId)
                ?? throw new HttpException(System.Net.HttpStatusCode.NotFound, "Sprinter with this ID does not exist");

            sprint.Tasks
                    .Where(t => t.State?.Name == BasicTaskStateTypes.ToDo
                        || t.State?.Name == BasicTaskStateTypes.InProgress)
                    .ToList()
                    .ForEach(t =>
                    {
                        t.SprintId = null;
                    });

            _db.Sprints.Remove(sprint);

            await _db.SaveChangesAsync();

            return true;
        }

        public async Task<SprintDto?> GetCurrentSprintByProjectId(int projectId)
        {
            var sprint = await _db.Sprints
                .Where(s => s.ProjectId == projectId && !s.IsComplete && s.StartAt != null)
                    .Include(s => s.Tasks)
                .FirstOrDefaultAsync();
            
            if (sprint == null)
                return null;

            var tasks = _mapper.Map<List<TaskDto>>(_db.Tasks
                .Where(t => t.SprintId == sprint.Id)
                .Include(t => t.Users)
                .Include(t => t.Author)
                .Include(t => t.Sprint)
                .Include(t => t.LastUpdatedBy)
                .Include(t => t.Priority)
                .Include(t => t.State)
                .Include(t => t.Project)
                .Include(t => t.Type));

            var dto = _mapper.Map<SprintDto>(sprint);
            dto.Tasks = _mapper.Map<List<TaskDto>>(tasks);

            return dto;
        }

    }
}
