using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.BLL.Exeptions;
﻿using FluentValidation;
using Tasque.Core.Common.DTO.Sprint;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.DTO.User;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;
using Task = System.Threading.Tasks.Task;
using Tasque.Core.Common.Models.Task;
using Tasque.Core.BLL.Extensions;

namespace Tasque.Core.BLL.Services
{
    public class SprintService : EntityCrudService<Sprint>
    {
        private IMapper _mapper;
        public SprintService(DataContext db, IMapper mapper) : base(db)
        {
            _mapper = mapper;
        }

        public async Task<IEnumerable<SprintDto>> GetProjectSprints(int projectId)
        {
            var sprints = await _db.Sprints
                .Where(s => s.ProjectId == projectId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<SprintDto>>(sprints);
        }
        public async Task<IEnumerable<TaskDto>> GetSprintTasks(int sprintId)
        {
            var tasks = await _db.Tasks
                .Where(t => t.SprintId == sprintId)
                .ToListAsync();

            return _mapper.Map<IEnumerable<TaskDto>>(tasks);
        }

        public async Task<IEnumerable<UserDto>> GetSprintUsers(int sprintId)
        {
            var users = await _db.Tasks
                .Include(t => t.Author)
                .Where(t => t.SprintId == sprintId)
                .Select(t =>t.Author)
                .GroupBy(x => x.Id)
                .Select(x => x.First())
                .ToListAsync();

            return _mapper.Map<IEnumerable<UserDto>>(users);
        }

        public override Sprint Create(Sprint entity)
        {
            entity.Order = _db.Sprints.Max(x => x.Order) + 1;
            _db.Sprints.Add(entity);
            _db.SaveChanges();
            return entity;
        }
        public async Task<Sprint> Edit(EditSprintDto dto)
        {
            var entity = await _db.Sprints.FirstOrDefaultAsync(s => s.Id == dto.Id)
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
                foreach(var taskId in dto.Tasks)
                {
                    var task = await _db.Tasks.FirstOrDefaultAsync(t => t.Id == taskId)
                        ?? throw new ValidationException("Task not found");
                    task.SprintId = dto.Id;
                    _db.Tasks.Update(task);
                }
            }
            
            _db.Sprints.Update(entity);
            await _db.SaveChangesAsync();
            return entity;
        }
        public async Task CompleteSprint(int sprintId)
        {
            var sprint = await _db.Sprints
                .Include(s => s.Tasks)
                .FirstOrDefaultAsync(s => s.Id == sprintId);

            if (sprint == null)
                throw new HttpException(System.Net.HttpStatusCode.NotFound, "Sprinter with this ID does not exist");

            sprint.Tasks
                    .Where(t => t.StateId == 1 || t.StateId == 3)
                    .ToList()
                    .ForEach(t =>
                        {
                           t.SprintId = null;
                        });

            sprint.IsComplete = true;

            _db.Update(sprint);
            await _db.SaveChangesAsync();
        }
        public async Task<IEnumerable<Sprint>> OrderSprints(IEnumerable<int> ids)
        {
            var sprints = _db.Sprints.Where(x => ids.Contains(x.Id));
            sprints.SetOrder(ids);
            await _db.SaveChangesAsync();
            return sprints.OrderBy(x => x.Order);
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
    }
}
