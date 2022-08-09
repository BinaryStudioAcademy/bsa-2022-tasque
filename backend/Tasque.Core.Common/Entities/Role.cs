using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Role : BaseEntity
{
    public Role()
    {
        Users = new List<User>();
    }
    public string Name { get; set; } = null!;

    public virtual ICollection<User> Users { get; set; }
}
