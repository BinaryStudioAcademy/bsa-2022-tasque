using Tasque.Core.Common.Entities;

namespace Tasque.Core.BLL.Options
{
    public class EmailConfirmationOptions
    {
        public string ConfirmationHost { get; set; } = null!;
        public string ConfirmationEndpoint { get; set; } = null!;
        public int TokenLifetime { get; set; }

        public string GetConfirmationPath(EmailConfirmationToken token) => 
            $"{ConfirmationHost}{ConfirmationEndpoint}?key={token.Token}";
    }
}
