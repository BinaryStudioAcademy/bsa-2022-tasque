using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Enums;
using Tasque.Core.Common.Security;
using Tasque.Core.DAL;
using Tasque.Core.Identity.Exeptions;
using Tasque.Core.Identity.JWT;
using Tasque.Core.Identity.Services.AuxiliaryServices;

// Ambiguity between model Task and System.Threading Task
using MSTask = System.Threading.Tasks.Task;

namespace Tasque.Core.Identity.Services
{
    public class PasswordResetService
    {
        private DataContext _context;
        private ConfirmationTokenService _confirmationTokenService;
        private JwtFactory _jwtFactory;
        public PasswordResetService(
            DataContext context,
            ConfirmationTokenService confirmationTokenService,
            JwtFactory jwtFactory)
        {
            _context = context;
            _confirmationTokenService = confirmationTokenService;
            _jwtFactory = jwtFactory;
        }

        public async Task<AuthTokenDto> Confirm(PasswordChangeDto body)
        {
            var key = body.Token;
            var password = body.Password;

            var token = await _confirmationTokenService.ConfirmToken(key, TokenKind.PasswordReset);
            var user = token.User;

            var salt = SecurityHelper.GetRandomBytes();
            user.Salt = Convert.ToBase64String(salt);
            user.Password = SecurityHelper.HashPassword(password, salt);
            _context.ConfirmationTokens.Remove(token);
            _context.SaveChanges();
            return new() { AccessToken = _jwtFactory.GenerateToken(user.Id, user.Name, user.Email) };
        }

        public async MSTask Request(string email)
        {
            var userEntity = _context.Users.FirstOrDefault(x => x.Email == email)
                ?? throw new ValidationException("No user with requested email");

            if (!userEntity.IsEmailConfirmed)
                throw new EmailNotConfirmedException(email);

            var token = await _context.ConfirmationTokens
                .FirstOrDefaultAsync(x =>
                    x.UserId == userEntity.Id
                    && x.Kind == TokenKind.PasswordReset);

            if (token == null || !token.IsValid)
                token = await _confirmationTokenService.CreateConfirmationToken(userEntity, TokenKind.PasswordReset);

            await _confirmationTokenService.SendConfirmationEmail(token);
        }

        public MSTask ValidateToken(Guid token)
        {
            return _confirmationTokenService.ConfirmToken(token, TokenKind.PasswordReset);
        }
    }
}
