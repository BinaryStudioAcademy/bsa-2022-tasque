namespace Tasque.Core.Common.DTO.User
{
    public class UserDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Email { get; set; } = null!;
        public bool IsEmailConfirmed { get; set; }
        public string? AvatarURL { get; set; }
    }
}
