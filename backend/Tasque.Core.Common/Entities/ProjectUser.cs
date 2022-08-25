using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities
{
    public class ProjectUser : BaseEntity
    {
        public Project Project { get; set; }
        public int ProjectId { get; set; }
        public User User { get; set; }
        public int UserId { get; set; }
        public Role Role { get; set; }
        public int RoleId { get; set; }
    }
}
