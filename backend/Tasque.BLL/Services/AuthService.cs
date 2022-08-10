using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Options;
using Tasque.Core.BLL.Exeptions;
using Tasque.Core.BLL.JWT;
using Tasque.Core.BLL.Options;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Security;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services
{
    public class AuthService
    {
        private DataContext _context;
        private IMapper _mapper;
        private JwtFactory _jwtFactory;
        private IValidator<User> _validator;
        private EmailConfirmationOptions _emailOptions;

        public AuthService(
            DataContext context, 
            IMapper mapper, 
            JwtFactory jwtFactory, 
            IValidator<User> validator, 
            IOptions<EmailConfirmationOptions> emailOptions)
        {
            _context = context;
            _mapper = mapper;
            _jwtFactory = jwtFactory;
            _validator = validator;
            _emailOptions = emailOptions.Value;
        }

        public async Task<UserDto> Login(UserLoginDto loginInfo)
        {
            var userEntity = await _context.Users.FirstOrDefaultAsync(x => x.Email == loginInfo.Email)
                ?? throw new ValidationException("No user with given email");

            if (!userEntity.IsEmailConfirmed)
                throw new EmailNotConfirmedException(userEntity.Email);

            if (!SecurityHelper.ValidatePassword(loginInfo.Password, userEntity.Password, userEntity.Salt))
                throw new ValidationException("Invalid password");

            return _mapper.Map<UserDto>(userEntity);
        }

        public async Task<UserDto> Login(Guid emailToken)
        {
            var confToken = await _context.EmailConfirmationTokens
                .Include(x => x.User)
                .FirstOrDefaultAsync(x => x.Token == emailToken)
                ?? throw new ValidationException("Invalid confirmation token");

            if (confToken.ExpiringAt < DateTime.Now)
            {
                _context.EmailConfirmationTokens.Remove(confToken);
                await _context.SaveChangesAsync();
                throw new ValidationException("Confirmation token expired");
            }

            confToken.User.IsEmailConfirmed = true;
            _context.EmailConfirmationTokens.Remove(confToken);
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

        public AuthTokenDto GetAccessToken(int id, string username, string email)
        {
            return new()
            {
                AccessToken = _jwtFactory.GenerateToken(id, username, email)
            };
        }
    }
}
