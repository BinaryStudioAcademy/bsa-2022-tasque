using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.BLL.Exeptions;
using Tasque.Core.BLL.JWT;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Security;
using Tasque.Core.DAL;

// Ambiguity between model Task and System.Threading Task
using MSTask = System.Threading.Tasks.Task;

namespace Tasque.Core.BLL.Services.Auth
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

        public async Task<string> Confirm(PasswordChangeDto body)
        {
            var key = body.Token;
            var password = body.Password;

            var token = await _confirmationTokenService.ConfirmToken(key, TokenKind.PasswordReset);
            var user = token.User;

            var salt = SecurityHelper.GetRandomBytes();
            user.Salt = Convert.ToBase64String(salt);
            user.Password = SecurityHelper.HashPassword(password, salt);
            _context.SaveChanges();
            return _jwtFactory.GenerateToken(user.Id, user.Name, user.Email);
        }

        public async MSTask Request(string email)
        {
            var userEntity = _context.Users.FirstOrDefault(x => x.Email == email && x.IsEmailConfirmed)
                ?? throw new EmailNotConfirmedException(email);

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
