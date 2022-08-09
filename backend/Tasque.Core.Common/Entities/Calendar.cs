using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Calendar : BaseEntity
{
    public int UserId { get; set; }
    public User User { get; set; } = null!;
}
