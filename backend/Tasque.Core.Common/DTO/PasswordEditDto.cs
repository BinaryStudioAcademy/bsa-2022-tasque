namespace Tasque.Core.Common.DTO
{
    public class PasswordEditDto
    {
        public int Id { get; set; }
        public string PreviousPassword { get; set; } = "";
        public string NewPassword { get; set; } = "";
    }
}
