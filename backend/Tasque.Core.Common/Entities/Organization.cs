using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Organization : BaseEntity
{
    public Organization()
    {
        Users = new List<User>();
    }
    public string Name { get; set; } = null!;

    public int AuthorId { get; set; }
    public User Author { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; }
}
