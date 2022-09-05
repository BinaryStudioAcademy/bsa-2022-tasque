namespace Tasque.Core.Common.DTO.User
{
    public class UserInfoDto
    {
        public int Id { get; set; }
        public string Email { get; set; } = null!;
        public string UserName { get; set; } = null!;
        public string? ProfileURL { get; set; }
        public string? AvatarURL { get; set; }
        public string? BusinessRole { get; set; }
    }
}
