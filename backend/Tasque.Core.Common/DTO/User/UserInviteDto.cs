namespace Tasque.Core.Common.DTO.User
{
    public class UserInviteDto
    {
        public int ProjectId { get; set; }
        public List<string> Emails { get; set; } = null!;
    }
}
