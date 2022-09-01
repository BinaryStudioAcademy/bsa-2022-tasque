﻿using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.DTO.Sprint;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.DTO.User;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;

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

    }
}
