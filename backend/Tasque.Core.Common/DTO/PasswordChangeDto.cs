namespace Tasque.Core.Common.DTO
{
    public class PasswordChangeDto
    {
        public Guid Token { get; set; }
        public string Password { get; set; } = "";
    }
}
