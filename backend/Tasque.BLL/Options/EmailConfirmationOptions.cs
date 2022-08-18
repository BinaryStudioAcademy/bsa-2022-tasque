using Tasque.Core.Common.Entities;

namespace Tasque.Core.BLL.Options
{
    public class EmailConfirmationOptions
    {
        public string Host { get; set; } = "";
        public string ConfirmationEndpoint { get; set; } = "";
        public string PasswordResetEndpoint { get; set; } = "";
        public string SenderEmail { get; set; } = null!;
        public string SenderName { get; set; } = null!;
        public int TokenLifetime { get; set; }

        public string GetConfirmationPath(ConfirmationToken token) =>
            $"{Host}{ConfirmationEndpoint}?key={token.Token}";
    }
}
