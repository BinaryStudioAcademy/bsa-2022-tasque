using Tasque.Core.Common.DTO.Project;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;
using Task = System.Threading.Tasks.Task;

namespace Tasque.Core.BLL.Services;

public class ProjectService : EntityCrudService<Project>
{
    public ProjectService(DataContext db) : base(db)
    {

    }

    public async Task<bool> InviteUser(InviteUserDTO dto)
    {
        var user = _db.Users.SingleOrDefault(u => u.Email == dto.UserEmail || u.IsEmailConfirmed);
        if (user is null)
        {
            return false;
        }

        var project = _db.Projects.Single(p => p.Id == dto.ProjectId);

        var invitation = new ProjectInvitation
        {
            User = user,
            Project = project,
        };

        _db.Invitations.Add(invitation);
        await _db.SaveChangesAsync();

        // TODO send notification

        return true;
    }
}
