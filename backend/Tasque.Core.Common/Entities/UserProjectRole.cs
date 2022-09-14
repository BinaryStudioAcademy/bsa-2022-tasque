using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class UserProjectRole : IBaseEntity
{
    public int RoleId { get; set; }
    public Role Role { get; set; } = null!;
    public int UserId { get; set; }
    public User User { get; set; } = null!;
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
}
