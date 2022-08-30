using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.DTO.User;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Security;
using Tasque.Core.DAL;
using Tasque.Core.Identity.Exeptions;
using Tasque.Core.Identity.JWT;
using Task = System.Threading.Tasks.Task;

namespace Tasque.Core.Identity.Services
{
    public class AuthService
    {
        private DataContext _context;
        private JwtFactory _jwtFactory;
        private IMapper _mapper;
        private IValidator<User> _validator;
        private ConfirmationTokenService _tokenService;

        public AuthService(
            DataContext context,
            JwtFactory jwtFactory,
            IMapper mapper,
            IValidator<User> validator,
            ConfirmationTokenService tokenService)
        {
            _context = context;
            _mapper = mapper;
            _jwtFactory = jwtFactory;
            _validator = validator;
            _tokenService = tokenService;
        }

        public async Task<UserDto> Login(UserLoginDto loginInfo)
        {
            var userEntity = await _context.Users.FirstOrDefaultAsync(x => x.Email == loginInfo.Email)
                ?? throw new ValidationException("No user with given email");

            if (!userEntity.IsEmailConfirmed)
            {
                if (!_context.ConfirmationTokens.Any(x => x.UserId == userEntity.Id))
                {
                    var token = await _tokenService.CreateConfirmationToken(userEntity, TokenKind.EmailConfirmation);
                    await _tokenService.SendConfirmationEmail(token);
                }
                throw new EmailNotConfirmedException(userEntity.Email);
            }

            if (!SecurityHelper.ValidatePassword(loginInfo.Password, userEntity.Password, userEntity.Salt))
                throw new ValidationException("Invalid password");

            return _mapper.Map<UserDto>(userEntity);
        }

        public async Task<UserDto> Login(Guid emailToken)
        {
            var confToken = await _tokenService.ConfirmToken(emailToken, TokenKind.EmailConfirmation);
            confToken.User.IsEmailConfirmed = true;
            _context.ConfirmationTokens.Remove(confToken);
            await _context.SaveChangesAsync();
            return _mapper.Map<UserDto>(confToken.User);
        }

        public async Task<AuthTokenDto?> Register(UserRegisterDto registerInfo)
        {
            var userEntity = new User();
            ConfirmationToken? token = null;

            if (registerInfo.Key.HasValue)
            {
                token = await _tokenService.ConfirmToken(registerInfo.Key!.Value, TokenKind.ReferralSignUp);
                if (token.User.Email != registerInfo.Email)
                    throw new ValidationException("Invalid token");
                userEntity = token.User;
                userEntity.IsEmailConfirmed = true;
            }

            userEntity = _mapper.Map(registerInfo, userEntity);
            _validator.ValidateAndThrow(userEntity);

            if (token == null && _context.Users.Any(x => x.Email == userEntity.Email))
            {
                throw new ValidationException("User with given email already exists");
            }

            var salt = SecurityHelper.GetRandomBytes();
            userEntity.Salt = Convert.ToBase64String(salt);
            userEntity.Password = SecurityHelper.HashPassword(registerInfo.Password, salt);

            AuthTokenDto? res = null;
            if (token == null)
            {
                _context.Users.Add(userEntity);
            }
            else
            {
                _context.Users.Update(userEntity);
                _context.ConfirmationTokens.Remove(token);
                res = GetAccessToken(userEntity.Id, userEntity.Name, userEntity.Email);
            }

            await _context.SaveChangesAsync();
            return res;
        }

        public async Task Register(string email)
        {
            var isEmail = Constants.EMAIL_REGEX.IsMatch(email);
            if (!isEmail)
                throw new ValidationException("Email is not valid");
            if (_context.Users.Any(x => x.Email == email))
                throw new ValidationException("User with given email already exists");

            var user = new User()
            {
                Email = email,
                Password = "",
                Salt = "",
                Name = ""
            };
            _context.Users.Add(user);
            await _context.SaveChangesAsync();

            var lifetime = TimeSpan.FromDays(365).TotalSeconds;
            var token = await _tokenService.CreateConfirmationToken(user, TokenKind.ReferralSignUp, lifetime);
            await _tokenService.SendConfirmationEmail(token);
        }

        public Task<bool> RequestEmailConfirmation(string email)
        {
            string errMsg = string.Empty;
            var entity = _context.Users.FirstOrDefault(x => x.Email == email);

            if (entity == null)
                errMsg = "No user with given email";
            else if (entity.IsEmailConfirmed)
                errMsg = "Email already confirmed";

            if (!string.IsNullOrEmpty(errMsg))
                throw new ValidationException(errMsg);
            return SendEmailConfirmation(entity!);
        }

        public AuthTokenDto GetAccessToken(int id, string username, string email)
        {
            return new()
            {
                AccessToken = _jwtFactory.GenerateToken(id, username, email)
            };
        }

        private async Task<bool> SendEmailConfirmation(User userEntity)
        {
            var token = await _tokenService.CreateConfirmationToken(userEntity, TokenKind.EmailConfirmation);
            await _tokenService.SendConfirmationEmail(token);
            return true;
        }

        public async Task<string> GetEmailFromReferralKey(Guid key)
        {
            var token = await _tokenService.ConfirmToken(key, TokenKind.ReferralSignUp);
            return token.User.Email;
        }
    }
}
