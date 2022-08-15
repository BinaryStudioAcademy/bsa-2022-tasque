using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services
{
    public class OrganizationService : EntityCrudService<Organization>
    {
        public OrganizationService(DataContext db) : base(db) { }

        public async Task<IEnumerable<Organization>> GetUserOrganizations(int userId)
        {
            var organizations = await _db.Users
                .Where(user => userId == user.Id)
                .SelectMany(user => user.ParticipatedProjects)
                .Union(_db.Users
                    .Where(user => userId == user.Id)
                    .SelectMany(user => user.OwnedProjects))
                .Include(x => x.Organization)
                .Select(project => project.Organization)
                .ToListAsync();

            return organizations;
        }
    }
}
