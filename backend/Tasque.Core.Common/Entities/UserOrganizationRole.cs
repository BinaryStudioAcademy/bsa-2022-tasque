using Tasque.Core.Common.Entities.Abstract;
using Tasque.Core.Common.Enums;

namespace Tasque.Core.Common.Entities
{
    public class UserOrganizationRole
    {
        public int OrganizationId { get; set; }

        public Organization Organization { get; set; } = null!;

        public int UserId { get; set; }

        public User User { get; set; } = null!;

        public UserOrganizationRoles Role { get; set; }
    }
}
