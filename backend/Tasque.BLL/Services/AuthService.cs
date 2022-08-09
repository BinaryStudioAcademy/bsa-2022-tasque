using AutoMapper;
using FluentValidation;
using Tasque.Core.BLL.JWT;
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

        public AuthService(DataContext context, IMapper mapper, JwtFactory jwtFactory, IValidator<User> validator)
        {
            _context = context;
            _mapper = mapper;
            _jwtFactory = jwtFactory;
            _validator = validator;
        }

        public Task<string> Login(UserLoginDto loginInfo)
        {
            throw new NotImplementedException();
        }

        public async Task<UserDto> Register(UserRegisterDto registerInfo)
        {
            var userEntity = _mapper.Map<User>(registerInfo);
            _validator.ValidateAndThrow(userEntity);

            var salt = SecurityHelper.GetRandomBytes();
            userEntity.Salt = Convert.ToBase64String(salt);
            userEntity.Password = SecurityHelper.HashPassword(registerInfo.Password, salt);
            
            if (_context.Users.Any(x => x.Email == userEntity.Email))
            {
                throw new ValidationException("User with given email already exists");
            }
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
