using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Role : BaseEntity
{
    public string Name { get; set; } = "";

    public virtual ICollection<User> Users { get; set; }
}
