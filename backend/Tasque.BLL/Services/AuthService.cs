using AutoMapper;
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

        public AuthService(DataContext context, IMapper mapper, JwtFactory jwtFactory)
        {
            _context = context;
            _mapper = mapper;
            _jwtFactory = jwtFactory;
        }

        public Task<string> Login(UserLoginDto loginInfo)
        {
            throw new NotImplementedException();
        }

        public async Task<UserDto> Register(UserRegisterDto registerInfo)
        {
            var userEntity = _mapper.Map<User>(registerInfo);
            var salt = SecurityHelper.GetRandomBytes();

            userEntity.Salt = Convert.ToBase64String(salt);
            userEntity.Password = SecurityHelper.HashPassword(registerInfo.Password, salt);

            _context.Users.Add(userEntity);
            await _context.SaveChangesAsync();

            return _mapper.Map<UserDto>(userEntity);
        }

        public string GetAccessToken(int id, string username, string email)
        {
            return _jwtFactory.GenerateToken(id, username, email);
        }
    }
}
