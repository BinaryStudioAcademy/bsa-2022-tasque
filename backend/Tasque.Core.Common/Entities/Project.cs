using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Project : BaseEntity
{
    public Project()
    {
        Users = new List<User>();
        UserRoles = new List<UserProjectRole>();
        Sprints = new List<Sprint>();
    }
    public string Name { get; set; } = null!;
    public string Key { get; set; } = null!;

    public int AuthorId { get; set; }
    public User Author { get; set; } = null!;

    public int OrganizationId { get; set; }
    public Organization Organization { get; set; } = null!;

    public virtual ICollection<ProjectInvitation> Invitations { get; set; }

    public virtual ICollection<User> Users { get; set; }
    public virtual ICollection<UserProjectRole> UserRoles { get; set; }
    public virtual ICollection<Sprint> Sprints { get; set; }
}
