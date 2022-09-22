using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;
using Tasque.Core.BLL.Options;
using Tasque.Core.BLL.Services;
using Tasque.Core.BLL.Services.Email;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Enums;
using Tasque.Core.Common.Models.Email;
using Tasque.Core.DAL;

namespace Tasque.Core.Identity.Services.AuxiliaryServices
{
    public class ConfirmationTokenService
    {
        private protected DataContext _context;
        private protected IEmailService _emailService;
        private protected EmailConfirmationOptions _emailOptions;
        private protected IConfiguration _configuration;

        public ConfirmationTokenService(
            DataContext context,
            IEmailService emailService,
            IOptions<EmailConfirmationOptions> emailOptions,
            IConfiguration configuration)
        {
            _context = context;
            _emailService = emailService;
            _emailOptions = emailOptions.Value;
            _configuration = configuration;
        }

        public async Task<ConfirmationToken> CreateConfirmationToken(User user, TokenKind kind, double? lifetime = null)
        {
            var existingTokens = _context.ConfirmationTokens
                .Where(x => x.UserId == user.Id && x.Kind == kind)
                .ToList()
                .Where(x => !x.IsValid);
            _context.ConfirmationTokens.RemoveRange(existingTokens);

            var confToken = new ConfirmationToken
            {
                User = user,
                ExpiringAt = DateTime.UtcNow.AddSeconds(lifetime ?? _emailOptions.TokenLifetime),
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
                Subject = GetEmailSubject(token.Kind),
                Content = await GetEmailText(token),
                Sender = new EmailContact(_emailOptions.SenderEmail, _emailOptions.SenderName)
            };
            return await _emailService.SendEmailAsync(email);
        }

        private async Task<string> GetEmailText(ConfirmationToken token)
        {
            var host = _emailOptions.Host;
            var endpoint = GetEndpoint(token.Kind);
            var link = $"{host}{endpoint}";
            var key = token.Token;
            var logo = _configuration["Host:BigLogo"];

            Dictionary<string, string> args = new()
            {
                { "appLink", host },
                { "logoLink", logo },
                { "username", token.User.Name },
                { "email", token.User.Email },
                { "link", $"{link}?key={key}" }
            };

            string html = await GetEmailHtml(token.Kind);
            foreach (var kv in args)
                html = html.Replace($"{{{kv.Key}}}", kv.Value);

            return html;
        }

        private protected string GetEndpoint(TokenKind kind)
        {
            return kind switch
            {
                TokenKind.EmailConfirmation => _emailOptions.ConfirmationEndpoint,
                TokenKind.PasswordReset => _emailOptions.PasswordResetEndpoint,
                TokenKind.ReferralSignUp => _emailOptions.InviteEndpoint,
                _ => ""
            };
        }

        private protected static string GetEmailSubject(TokenKind kind)
        {
            return kind switch
            {
                TokenKind.EmailConfirmation => "Email confirmation",
                TokenKind.PasswordReset => "Password reset",
                TokenKind.ReferralSignUp => "Tasque invitation",
                _ => ""
            };
        }

        private protected static async Task<string> GetEmailHtml(TokenKind kind)
        {
            return kind switch
            {
                TokenKind.PasswordReset => await AssemblyResourceService.GetResource(AssemblyResource.ResetPasswordMessage),
                TokenKind.EmailConfirmation => await AssemblyResourceService.GetResource(AssemblyResource.ConfirmEmailMessage),
                TokenKind.ReferralSignUp => await AssemblyResourceService.GetResource(AssemblyResource.ReferralInvitationMessage),
                _ => ""
            };
        }
    }
}
