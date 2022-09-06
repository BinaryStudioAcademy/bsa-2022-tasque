using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;
using Task = Tasque.Core.Common.Entities.Task;

namespace Tasque.Core.BLL.Services
{
    public class TasksService : EntityCrudService<Task>
    {
        public TasksService(DataContext db) : base(db)
        {
        }

        public async System.Threading.Tasks.Task MoveTask(Task task, BoardColumn column)
        {
            // TODO change when BoardColumn is restructured

            task.BoardColumn = column;
            task.BoardColumnId = column.Id;

            _db.Update(task);
            await _db.SaveChangesAsync();

            // TODO add message to queue
        }

        public async System.Threading.Tasks.Task AddCommentToTask(Task task, Comment comment)
        {
            task.Comments.Add(comment);

            _db.Update(task);
            await _db.SaveChangesAsync();

            // TODO add message to queue
        }
    }
}
