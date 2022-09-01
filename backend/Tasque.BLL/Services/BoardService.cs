using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.DTO.Board;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services
{
    public class BoardService
    {
        private DataContext _db;
        private IMapper _mapper;

        public BoardService(DataContext context, IMapper mapper)
        {
            _db = context;
            _mapper = mapper;
        }

        public async Task<BoardInfoDto> GetBoardByProjectId(int projectId)
        {
            var board = await _db.Boards
                .FirstOrDefaultAsync(b => b.ProjectId == projectId);

            var column = await _db.BoardColumns
                .Where(c => c.BoardId == board.Id)
                .ToListAsync();

            var tasks = await _db.Tasks.Where()
        }
    }
}
