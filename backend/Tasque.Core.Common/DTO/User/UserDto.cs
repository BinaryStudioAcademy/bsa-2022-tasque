using Tasque.Core.Common.DTO.User.UserRoles;

namespace Tasque.Core.Common.DTO.User
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public bool IsEmailConfirmed { get; set; }
        public string? AvatarURL { get; set; }
        public List<UserOrganizationRoleDto> OrganizationRoles { get; set; }

        public List<UserProjectRoleDto> Roles { get; set; }

        public UserDto()
        {
            OrganizationRoles = new();
            Roles = new();
        }
    }
}
