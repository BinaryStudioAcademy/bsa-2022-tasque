using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Project : BaseEntity
{
    public Project()
    {
        Users = new List<UserProjectRole>();
    }
    public string Name { get; set; } = null!;

    public int AuthorId { get; set; }
    public User Author { get; set; } = null!;

    public int OrganizationId { get; set; }
    public Organization Organization { get; set; } = null!;

    public virtual ICollection<UserProjectRole> Users { get; set; }
}
