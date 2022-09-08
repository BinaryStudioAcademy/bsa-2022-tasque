using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.DTO.Board;
using Tasque.Core.Common.DTO.Task;
using Tasque.Core.DAL;
using Tasque.Core.Common.Entities;
using System.Reflection.Metadata.Ecma335;
using AutoMapper;
using Tasque.Core.Common.DTO.User;
using Tasque.Core.BLL.Exceptions;

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

        //public async Task<BoardInfoDto?> GetBoardByProjectId(int projectId)
        //{
        //    var board = await _db.Boards
        //        .FirstOrDefaultAsync(b => b.ProjectId == projectId)
        //        ?? throw new CustomNotFoundException($"board");

        //    var project = await _db.Projects.Include(p => p.Users)
        //        .FirstOrDefaultAsync(p => p.Id == projectId)
        //        ?? throw new CustomNotFoundException($"project with id {projectId}");

        //    var users = _mapper.Map<List<UserDto>>(project.Users);

        //    var columns = await _db.BoardColumns
        //        .Where(c => c.BoardId == board.Id)
        //        .ToListAsync();
        //    var ids = columns.Select(c => c.Id).ToList();

        //    var tasks = await _db.Tasks
        //        .Include(t => t.Project).Include(t => t.Author)
        //        .Where(t => ids.Contains(t.BoardColumnId ?? 0))
        //        .Select(t => new
        //        {
        //            columnId = t.BoardColumnId,
        //            taskInfo = new TaskInfoDto()
        //            {
        //                Id = t.Id,
        //                AttachmentUrl = (t.Attachments.FirstOrDefault() ?? new Attachment()).URL,
        //                Summary = t.Summary,
        //                Description = t.Description ?? "",
        //                ProjectKey = t.Project.Key,
        //                User = _mapper.Map<UserDto>(t.Author)
        //            }
        //        })
        //        .ToListAsync();

        //    var result = new BoardInfoDto()
        //    {
        //        Id = board.Id,
        //        ProjectId = projectId,
        //        Name = board.Name,
        //        ProjectName = project.Name,
        //        Users = users,
        //        Columns = columns.Select(c => new BoardColumnDto
        //        {
        //            Id = c.Id,
        //            ColumnName = c.Name,
        //            Tasks = tasks.Where(t => t.columnId == c.Id)
        //                .Select(t => t.taskInfo).ToList()
        //        }).ToList()
        //    };
        //    return result;
        //}

    //    public async Task<BoardInfoDto?> UpdateBoardColumns(BoardInfoDto board)
    //    {
    //        if (board.Columns == null)
    //        {
    //            return board;
    //        }
    //        foreach (var column in board.Columns)
    //        {
    //            if(column.Id == 0)
    //            {
    //                var columnEntity = await _db.BoardColumns.AddAsync(new BoardColumn()
    //                {
    //                    Id = column.Id,
    //                    BoardId = board.Id,
    //                    Name = column.ColumnName,
    //                    CreatedAt = DateTime.UtcNow,
    //                    UpdatedAt = DateTime.UtcNow
    //                });
    //                await _db.SaveChangesAsync();
    //                column.Id = columnEntity.Entity.Id;
    //            }
    //            else if (column.Tasks != null)
    //            {
    //                foreach (var task in column.Tasks)
    //                {
    //                    var taskEntity = await _db.Tasks.FirstAsync(t => t.Id == task.Id);
    //                    taskEntity.BoardColumnId = column.Id;
    //                    _db.Tasks.Update(taskEntity);
    //                }
    //            }
    //        }
    //        await _db.SaveChangesAsync();
    //        return board;
    //    }

    }
}
