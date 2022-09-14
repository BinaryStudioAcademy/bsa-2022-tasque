using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.DTO.Task;

using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services
{
    public class BacklogService
    {
        private IMapper _mapper;
        private DataContext _context;
        public BacklogService(DataContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<IEnumerable<TaskDto>> GetBacklogTasks(int projectId)
        {
            var tasks = await _context.Tasks
                .Include(t=> t.Users)
                .Where(t => t.ProjectId == projectId && t.SprintId == null)
                .ToListAsync();

            return _mapper.Map<IEnumerable<TaskDto>>(tasks);
        }
    }
}
