using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Calendar : BaseEntity, IBaseEntity
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}
