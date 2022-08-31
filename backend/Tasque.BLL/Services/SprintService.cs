using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Security;
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

    }
}
