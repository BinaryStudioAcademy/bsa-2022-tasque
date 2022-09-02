using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.DTO.Board;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.DAL;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.BLL.Services
{
    public class BoardService
    {
        private DataContext _db;

        public BoardService(DataContext context)
        {
            _db = context;
        }

        public async Task<BoardInfoDto?> GetBoardByProjectId(int projectId)
        {
            var board = await _db.Boards
                .FirstOrDefaultAsync(b => b.ProjectId == projectId);

            if (board == null)
            {
                return null;
            }

            var columns = await _db.BoardColumns
                .Where(c => c.BoardId == board.Id)
                .ToListAsync();
            var ids = columns.Select(c => c.Id).ToList();

            var tasks = await _db.Tasks
                .Include(t => t.Project).Include(t => t.Author)
                .Where(t => ids.Contains(t.BoardColumnId ?? 0))
                .Select(t => new
                {
                    columnId = t.BoardColumnId,
                    taskInfo = new TaskInfoDto()
                    {
                        Id = t.Id,
                        AttachmentUrl = (t.Attachments.FirstOrDefault() ?? new Attachment()).URL,
                        Description = t.Description ?? "Task does not have description yet",
                        ProjectKey = t.Project.Key,
                        UserAvatarUrl = t.Author.AvatarURL
                    }
                })
                .ToListAsync();

            var result = new BoardInfoDto()
            {
                Id = board.Id,
                ProjectId = projectId,
                Name = board.Name,
                Columns = columns.Select(c => new BoardColumnDto
                {
                    Id = c.Id,
                    ColumnName = c.Name,
                    Tasks = tasks.Where(t => t.columnId == c.Id)
                        .Select(t => t.taskInfo).ToList()
                }).ToList()
            };
            return result;
        }

    }
}
