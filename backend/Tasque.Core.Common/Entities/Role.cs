using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Role : BaseEntity, IBaseEntity
{
    public Role()
    {
        Users = new List<UserProjectRole>();
    }
    public string Name { get; set; } = null!;

    public virtual ICollection<UserProjectRole> Users { get; set; }
}
