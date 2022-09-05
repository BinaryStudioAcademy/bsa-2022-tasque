using Microsoft.EntityFrameworkCore;
using Tasque.Core.BLL.Exeptions;
﻿using FluentValidation;
using Tasque.Core.Common.DTO.Sprint;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;
using Task = System.Threading.Tasks.Task;
using Tasque.Core.BLL.Extensions;

namespace Tasque.Core.BLL.Services
{
    public class SprintService : EntityCrudService<Sprint>
    {
        public SprintService(DataContext db) : base(db)
        {
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
            var sprint = await _db.Sprints.FirstOrDefaultAsync(s => s.Id == sprintId);

            if (sprint == null)
                throw new HttpException(System.Net.HttpStatusCode.NotFound, "Sprinter with this ID does not exist");

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
    }
}
