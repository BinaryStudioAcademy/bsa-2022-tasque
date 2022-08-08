using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Project : BaseEntity
{
    public string Name { get; set; } = "";

    public int AuthorId { get; set; }
    public User Author { get; set; }

    public int OrganizationId { get; set; }
    public Organization Organization { get; set; }

    public virtual ICollection<User> Users { get; set; }
}
