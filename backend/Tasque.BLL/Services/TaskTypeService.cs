using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services
{
    public class TaskTypeService : EntityCrudService<TaskType>
    {
        private readonly IMapper _mapper;
        public TaskTypeService(DataContext db, IMapper mapper) : base(db)
        {
            _mapper = mapper;
        }

        public List<TaskTypeDto> GetAllTaskTypesByProjectId(int projectId)
        {
            var types = _mapper.Map<List<TaskTypeDto>>(_db.TaskTypes.Where(t => t.ProjectId == projectId));
            return types;
        }
    }
}
