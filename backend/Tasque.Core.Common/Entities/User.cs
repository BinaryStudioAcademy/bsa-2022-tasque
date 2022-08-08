using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class User : BaseEntity
{
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
    public string Salt { get; set; } = "";

    public virtual ICollection<Task> Tasks { get; set; }
    public virtual ICollection<Meeting> Meetings { get; set; }
    public virtual ICollection<Project> Projects { get; set; }
    public virtual ICollection<Role> Roles { get; set; }
}
