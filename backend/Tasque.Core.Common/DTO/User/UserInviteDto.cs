namespace Tasque.Core.Common.DTO.User
{
    public class UserInviteDto
    {
        public int ProjectId { get; set; }
        public string Email { get; set; } = null!;
    }
}
