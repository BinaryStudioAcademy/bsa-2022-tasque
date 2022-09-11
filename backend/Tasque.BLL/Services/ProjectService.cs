using Tasque.Core.Common.DTO.Project;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Models.Events;
using Tasque.Core.DAL;
using Tasque.Messaging.Abstractions;
using Task = System.Threading.Tasks.Task;

namespace Tasque.Core.BLL.Services;

public class ProjectService : EntityCrudService<Project>
{
    private readonly IEventBus _bus;
    public ProjectService(DataContext db, IEventBus bus) : base(db)
    {
        _bus = bus;
    }

    public async Task<bool> InviteUser(InviteUserDTO dto)
    {
        var invitee = _db.Users.SingleOrDefault(u => u.Email == dto.InviteeEmail || u.IsEmailConfirmed);
        if (invitee is null)
        {
            return false;
        }

        var invitor = _db.Users.SingleOrDefault(u => u.Email == dto.InvitorEmail || u.IsEmailConfirmed);
        if (invitor is null)
        {
            return false;
        }

        var project = _db.Projects.Single(p => p.Id == dto.ProjectId);

        var invitation = new ProjectInvitation
        {
            User = invitee,
            Project = project,
        };

        _db.Invitations.Add(invitation);
        await _db.SaveChangesAsync();

        UserInvitedEvent @event = new UserInvitedEvent
        {
            ProjectId = project.Id,
            InviteeId = invitee.Id,
            InvitorId = invitor.Id
        };

        _bus.Publish(@event);

        return true;
    }
}
