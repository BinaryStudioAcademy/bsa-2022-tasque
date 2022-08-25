using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Security;
using Tasque.Core.DAL;
using Tasque.Core.Identity.Exeptions;
using Tasque.Core.Identity.JWT;

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
            return _mapper.Map<UserDto>(userEntity);
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
