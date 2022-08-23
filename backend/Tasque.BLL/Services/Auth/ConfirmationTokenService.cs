using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
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
            var existingTokens = _context.ConfirmationTokens
                .Where(x => x.UserId == user.Id && x.Kind == kind)
                .ToList()
                .Where(x => !x.IsValid);
            _context.ConfirmationTokens.RemoveRange(existingTokens);

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
        public async Task<bool> SendConfirmationEmail(ConfirmationToken token)
        {
            var user = token.User;
            var reciever = new EmailContact(user.Email, user.Name);
            var email = new EmailMessage(reciever)
            {
                Subject = GetEmailSubject(token),
                Content = await GetEmailText(token),
                Sender = new EmailContact(_emailOptions.SenderEmail, _emailOptions.SenderName)
            };
            return await _emailService.SendEmailAsync(email);
        }

        private async Task<string> GetEmailText(ConfirmationToken token)
        {   
            var host = _emailOptions.Host;
            var endpoint = GetEndpoint(token);
            var link = $"{host}{endpoint}";
            var key = token.Token;
            
            Dictionary<string, string> args = new()
            {
                { "appLink", host },
                { "logoLink", "http://localhost:9700/thumbnail_1080p.png" },
                { "username", token.User.Name },
                { "email", token.User.Email },
                { "link", $"{link}?key={key}" }
            };

            string html = await GetEmailHtml(token);
            foreach (var kv in args)
                html = html.Replace($"{{{kv.Key}}}", kv.Value);

            return html;
        }

        private string GetEndpoint(ConfirmationToken token)
        {
            return token.Kind switch
            {
                TokenKind.EmailConfirmation => _emailOptions.ConfirmationEndpoint,
                TokenKind.PasswordReset => _emailOptions.PasswordResetEndpoint,
                _ => ""
            };
        }

        private static string GetEmailSubject(ConfirmationToken token)
        {
            return token.Kind switch
            {
                TokenKind.EmailConfirmation => "Email confirmation",
                TokenKind.PasswordReset => "Password reset",
                _ => ""
            };
        }

        private static async Task<string> GetEmailHtml(ConfirmationToken token)
        {
            return token.Kind switch
            {
                TokenKind.PasswordReset => await AssemblyResourceService.GetResource(AssemblyResource.ConfirmEmailMessage),
                _ => ""
            };
        }
    }
}
