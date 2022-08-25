namespace Tasque.Core.Common.DTO.User
{
    public class UserInfoDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string ProfileURL { get; set; } = null!;
        public string? AvatarURL { get; set; }
    }
}
