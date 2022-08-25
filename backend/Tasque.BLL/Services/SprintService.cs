using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Security;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services
{
    public class SprintService
    {
        private DataContext _context;
        private IMapper _mapper;

        public SprintService(
            DataContext context,
            IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        public async Task<SprintDto> GetSprintById(int id)
        {
            if (!await _context.Sprints.AnyAsync(u => u.Id == id))
            {
                throw new ValidationException("Sprint with given id does not exist");
            }
            var sprintEntity = await _context.Sprints.FirstAsync(u => u.Id == id);
            return _mapper.Map<SprintDto>(sprintEntity);
        }
    }
}
