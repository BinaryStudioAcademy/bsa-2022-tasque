using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.DTO.Board;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Models.Events;
using Tasque.Core.DAL;
using Tasque.Messaging.Abstractions;
using Task = System.Threading.Tasks.Task;

namespace Tasque.Core.BLL.Services
{
    public class BoardService : EntityCrudService<Board>
    {
        private DataContext _context;
        private IMapper _mapper;
        private readonly IEventBus _bus;

        public BoardService(DataContext context, IMapper mapper, IEventBus bus) : base(context)
        {
            _context = context;
            _mapper = mapper;
            _bus = bus;
        }

        public async Task<ICollection<BoardDto>> GetUserBoards(int userId)
        {
            var userEntity = await _db.Users.FirstOrDefaultAsync(u => u.Id == userId)
                  ?? throw new ValidationException("User not found");

            var boardEntity = await _context.Boards.Where(b => b.Project.Users.Contains(userEntity))
                .ToListAsync();

            return _mapper.Map<ICollection<BoardDto>>(boardEntity);
        }

        public async Task MoveTask(MoveTaskDTO dto)
        {
            var previousBoardColumn = _db.BoardColumns.Single(b => b.Id == dto.PreviousBoardId);
            var currentBoardColumn = _db.BoardColumns.Single(b => b.Id == dto.CurrentBoardId);
            var task = _db.Tasks.Single(t => t.Id == dto.TaskId);

            previousBoardColumn.Tasks.Remove(task);
            currentBoardColumn.Tasks.Add(task);

            _db.Update(previousBoardColumn);
            _db.Update(currentBoardColumn);
            await _db.SaveChangesAsync();

            TaskMovedEvent @event = new()
            {
                PreviousColumnId = dto.PreviousBoardId,
                NewColumnId = dto.CurrentBoardId,
                TaskId = task.Id,
                TaskAuthorId = task.AuthorId
            };

            _bus.Publish(@event);
        }
    }
}
