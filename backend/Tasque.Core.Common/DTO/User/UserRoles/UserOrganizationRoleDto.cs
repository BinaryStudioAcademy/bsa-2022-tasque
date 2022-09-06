using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Enums;

namespace Tasque.Core.Common.DTO.User.UserRoles
{
    public class UserOrganizationRoleDto
    {
        public int OrganizationId { get; set; }

        public int UserId { get; set; }

        public UserOrganizationRoles Role { get; set; }
    }
}
