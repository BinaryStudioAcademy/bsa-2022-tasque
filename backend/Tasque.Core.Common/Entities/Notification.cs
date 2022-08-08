using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Notification : BaseEntity
{
    public string Message { get; set; } = null!;

    public int UserId { get; set; }
    public User User { get; set; } = null!;
}
