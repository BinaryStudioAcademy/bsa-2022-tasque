namespace Tasque.Core.Common.DTO.Project
{
    public class ChangeUserRoleDto
    {
        public int ProjectId { get; set; }
        public int UserId { get; set; }
        public int RoleId { get; set; }
    }
}
