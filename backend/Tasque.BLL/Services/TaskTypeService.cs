using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services
{
    public class TaskTypeService : EntityCrudService<TaskType>
    {
        private readonly IMapper _mapper;
        public TaskTypeService(DataContext db) : base(db)
        {

        }

        public async Task<IEnumerable<TaskType>> GetAll()
        {
            var tasksTypes = await _db.TaskTypes
                .ToListAsync();

            return tasksTypes;
        }
    }
}
