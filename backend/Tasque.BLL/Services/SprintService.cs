using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.DTO.Sprint;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services
{
    public class SprintService : EntityCrudService<Sprint>
    {
        public SprintService(DataContext db) : base(db)
        {

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
