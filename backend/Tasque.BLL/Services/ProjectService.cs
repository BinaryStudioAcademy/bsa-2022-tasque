using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services;

public class ProjectService : EntityCrudService<Project>
{
    public ProjectService(DataContext db) : base(db)
    {

    }

    public async Task<IEnumerable<User>> GetProjectTeam(int projectId)
    {
        var users = _db.UserProjectRoles
            .Include(x => x.User).ThenInclude(x => x.Roles)
            .Where(x => x.ProjectId == projectId).Select(x => x.User);
        return await users.ToListAsync();
    }
}
