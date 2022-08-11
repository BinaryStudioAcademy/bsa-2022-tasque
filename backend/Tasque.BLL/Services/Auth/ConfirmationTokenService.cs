using Tasque.Core.BLL.Options;
using Tasque.Core.BLL.Services.Email;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Models.Email;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services.Auth
{
    public class ConfirmationTokenService
    {
        private DataContext _context;
        private IEmailService _emailService;
        private EmailConfirmationOptions _emailOptions;

        public ConfirmationTokenService(DataContext context, IEmailService emailService, EmailConfirmationOptions emailOptions)
        {
            _context = context;
            _emailService = emailService;
            _emailOptions = emailOptions;
        }

        public async Task<ConfirmationToken> CreateConfirmationToken(User user, TokenKind kind)
        {
            var confToken = new ConfirmationToken
            {
                User = user,
                ExpiringAt = DateTime.UtcNow.AddSeconds(_emailOptions.TokenLifetime),
                Kind = kind
            };
            _context.ConfirmationTokens.Add(confToken);
            await _context.SaveChangesAsync();
            return confToken;
        }

        public Task<bool> SendConfirmationEmail(ConfirmationToken token)
        {
            var user = token.User;
            var reciever = new EmailContact(user.Email, user.Name);
            var email = new EmailMessage(reciever)
            {
                Subject = "Successful registration",
                Content =
                    "<h3>Thanks for choosing Tasque</h3><br/>" +
                    $"<a href=\"{_emailOptions.GetConfirmationPath(token)}\">" +
                    "CLick here to confirm your email" +
                    "</a>"
            };
            return _emailService.SendEmailAsync(email);
        }
    }
}
