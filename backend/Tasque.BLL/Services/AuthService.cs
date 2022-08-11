using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using System.Runtime.CompilerServices;
using Tasque.Core.BLL.Exeptions;
using Tasque.Core.BLL.JWT;
using Tasque.Core.BLL.Options;
using Tasque.Core.BLL.Services.Email;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Models.Email;
using Tasque.Core.Common.Security;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services
{
    public class AuthService
    {
        private DataContext _context;        
        private JwtFactory _jwtFactory;
        private IEmailService _emailService;
        private IMapper _mapper;
        private IValidator<User> _validator;
        private EmailConfirmationOptions _emailOptions;

        public AuthService(
            DataContext context,            
            JwtFactory jwtFactory,
            IEmailService emailService,
            IMapper mapper,
            IValidator<User> validator, 
            IOptions<EmailConfirmationOptions> emailOptions)
        {
            _context = context;
            _mapper = mapper;
            _jwtFactory = jwtFactory;
            _validator = validator;
            _emailOptions = emailOptions.Value;
            _emailService = emailService;
        }

        public async Task<UserDto> Login(UserLoginDto loginInfo)
        {
            var userEntity = await _context.Users.FirstOrDefaultAsync(x => x.Email == loginInfo.Email)
                ?? throw new ValidationException("No user with given email");

            if (!userEntity.IsEmailConfirmed) 
            {
                if (!_context.ConfirmationTokens.Any(x => x.UserId == userEntity.Id))
                {
                    var token = await CreateConfirmationToken(userEntity);
                    await SendConfirmationEmail(token);
                }
                throw new EmailNotConfirmedException(userEntity.Email);
            }                

            if (!SecurityHelper.ValidatePassword(loginInfo.Password, userEntity.Password, userEntity.Salt))
                throw new ValidationException("Invalid password");

            return _mapper.Map<UserDto>(userEntity);
        }

        public async Task<UserDto> Login(Guid emailToken)
        {
            var confToken = await _context.ConfirmationTokens
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.Token == emailToken && x.Kind == TokenKind.EmailConfirmation)
                ?? throw new ValidationException("Invalid confirmation token");

            if (confToken.ExpiringAt < DateTime.UtcNow)
            {
                _context.ConfirmationTokens.Remove(confToken);
                await _context.SaveChangesAsync();
                throw new ValidationException("Confirmation token expired");
            }

            confToken.User.IsEmailConfirmed = true;
            _context.ConfirmationTokens.Remove(confToken);
            await _context.SaveChangesAsync();
            return _mapper.Map<UserDto>(confToken.User);
        }

        public async Task<UserDto> Register(UserRegisterDto registerInfo)
        {
            var userEntity = _mapper.Map<User>(registerInfo);
            _validator.ValidateAndThrow(userEntity);

            if (_context.Users.Any(x => x.Email == userEntity.Email))
            {
                throw new ValidationException("User with given email already exists");
            }

            var salt = SecurityHelper.GetRandomBytes();
            userEntity.Salt = Convert.ToBase64String(salt);
            userEntity.Password = SecurityHelper.HashPassword(registerInfo.Password, salt);

            _context.Users.Add(userEntity);
            await _context.SaveChangesAsync();

            var token = await CreateConfirmationToken(userEntity);
            await SendConfirmationEmail(token);
            return _mapper.Map<UserDto>(userEntity);
        }

        public AuthTokenDto GetAccessToken(int id, string username, string email)
        {
            return new()
            {
                AccessToken = _jwtFactory.GenerateToken(id, username, email)
            };
        }

        private async Task<ConfirmationToken> CreateConfirmationToken(User user)
        {
            var confToken = new ConfirmationToken
            {
                User = user,
                ExpiringAt = DateTime.UtcNow.AddSeconds(_emailOptions.TokenLifetime),
                Kind = TokenKind.EmailConfirmation
            };
            _context.ConfirmationTokens.Add(confToken);
            await _context.SaveChangesAsync();
            return confToken;
        }

        private Task<bool> SendConfirmationEmail(ConfirmationToken token)
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
