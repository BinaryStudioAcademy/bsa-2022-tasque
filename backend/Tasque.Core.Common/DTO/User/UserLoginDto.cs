namespace Tasque.Core.Common.DTO.User
{
    public class UserLoginDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public bool IsInvitedToOrganization { get; set; }
        public Guid? Key { get; set; }
    }
}
