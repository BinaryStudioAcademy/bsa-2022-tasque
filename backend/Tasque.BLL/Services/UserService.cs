using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.BLL.Exeptions;
using Tasque.Core.BLL.JWT;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Security;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services
{
    public class UserService
    {
        private DataContext _context;
        private IMapper _mapper;
        private IValidator<User> _validator;

        public UserService(
            DataContext context,
            IMapper mapper,
            IValidator<User> validator)
        {
            _context = context;
            _mapper = mapper;
            _validator = validator;
        }

        public async Task<UserDto> GetUserById(int id)
        {
            if (!await _context.Users.AnyAsync(u => u.Id == id))
            {
                throw new ValidationException("User with given id does not exist");
            }
            var userEntity = await _context.Users.FirstAsync(u => u.Id == id);
            return _mapper.Map<UserDto>(userEntity);
        }
    }
}
