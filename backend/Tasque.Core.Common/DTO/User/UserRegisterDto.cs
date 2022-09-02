namespace Tasque.Core.Common.DTO.User
{
    public class UserRegisterDto
    {
        public string Email { get; set; } = null!;
        public string Password { get; set; } = null!;
        public string Name { get; set; } = null!;
        public Guid? Key { get; set; }
    }
}
