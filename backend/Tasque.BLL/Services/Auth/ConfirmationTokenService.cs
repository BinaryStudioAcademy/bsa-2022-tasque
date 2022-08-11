using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.ComponentModel.DataAnnotations;
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

        public ConfirmationTokenService(
            DataContext context, 
            IEmailService emailService, 
            IOptions<EmailConfirmationOptions> emailOptions)
        {
            _context = context;
            _emailService = emailService;
            _emailOptions = emailOptions.Value;
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
        public async Task<ConfirmationToken> ConfirmToken(Guid key, TokenKind kind)
        {
            var confToken = await _context.ConfirmationTokens
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.Token == key && x.Kind == kind)
                ?? throw new ValidationException("Invalid confirmation token");

            if (!confToken.IsValid)
            {
                _context.ConfirmationTokens.Remove(confToken);
                await _context.SaveChangesAsync();
                throw new ValidationException("Confirmation token expired");
            }

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
