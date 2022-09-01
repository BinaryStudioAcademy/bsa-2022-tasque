using Microsoft.EntityFrameworkCore;
using Tasque.Core.BLL.Exeptions;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;
using Task = System.Threading.Tasks.Task;

namespace Tasque.Core.BLL.Services
{
    public class SprintService : EntityCrudService<Sprint>
    {
        public SprintService(DataContext db) : base(db)
        {

        }

        public async Task CompleteSprint(int sprintId)
        {
            var sprint = await _db.Sprints
                .Where(s => s.Id == sprintId)
                .FirstOrDefaultAsync();

            if (sprint == null)
                throw new HttpException(System.Net.HttpStatusCode.NotFound, "Sprinter with this ID does not exist");

            sprint.IsComplete = true;

            _db.Update(sprint);
            await _db.SaveChangesAsync();
        }
    }
}
