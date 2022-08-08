using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class User : BaseEntity
{
    public User()
    {
        Tasks = new List<Task>();
        Meetings = new List<Meeting>();
        Projects = new List<Project>();
        Roles = new List<Role>();
    }
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Salt { get; set; } = null!;

    public virtual ICollection<Task> Tasks { get; set; }
    public virtual ICollection<Meeting> Meetings { get; set; }
    public virtual ICollection<Project> Projects { get; set; }
    public virtual ICollection<Role> Roles { get; set; }
}
