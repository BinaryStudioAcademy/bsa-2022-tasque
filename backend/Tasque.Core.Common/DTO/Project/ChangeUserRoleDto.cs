namespace Tasque.Core.Common.DTO.Project
{
    public class ChangeUserRoleDto
    {
        public int ProjectId { get; set; }
        public List<UserWithRoleDto> UserWithRole { get; set; } = null!;
    }

    public class UserWithRoleDto
    {
        public int UserId { get; set; }
        public int RoleId { get; set; }
    }
}
