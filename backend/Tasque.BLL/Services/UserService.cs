using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.DTO.User;
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
        private FileUploadService _fileUploadService;

        public UserService(
            DataContext context,
            IMapper mapper,
            IValidator<User> validator,
            FileUploadService fileUploadService)
        {
            _context = context;
            _mapper = mapper;
            _validator = validator;
            _fileUploadService = fileUploadService;
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

        public async Task<UserDto> EditUserProfile(UserDto dto)
        {
            var userEntity = await _context.Users.FirstOrDefaultAsync(u => u.Id == dto.Id)
                ?? throw new ValidationException("User not found");
            userEntity.Name = dto.Name;

            _validator.ValidateAndThrow(userEntity);

            _context.Users.Update(userEntity);
            await _context.SaveChangesAsync();
            return _mapper.Map<UserDto>(userEntity);
        }

        public async Task<UserDto> EditUserAvatar(int userId, ImageDto imageData)
        {
            var userEntity = await _context.Users.FindAsync(userId)
                ?? throw new ValidationException("No user with given id");
            var imgStr = imageData.ImageData;
            string? newUrl = imgStr;
            if (!string.IsNullOrEmpty(imgStr)
                && !imgStr.StartsWith("http://")
                && !imgStr.StartsWith("https://"))
            {
                newUrl = await _fileUploadService.UploadFileAsync(imgStr, "avatars");
            }

            userEntity.AvatarURL = newUrl;
            _context.SaveChanges();
            return _mapper.Map<UserDto>(userEntity);
        }

        public async Task<PasswordEditDto> EditPassword(PasswordEditDto dto)
        {
            var userEntity = await _context.Users.FirstOrDefaultAsync(u => u.Id == dto.Id)
                ?? throw new ValidationException("User not found");
            if (!SecurityHelper.ValidatePassword(dto.PreviousPassword, userEntity.Password, userEntity.Salt))
                throw new ValidationException("Invalid password");
            userEntity.Password = SecurityHelper.HashPassword(dto.NewPassword, userEntity.Salt);
            _validator.ValidateAndThrow(userEntity);

            _context.Users.Update(userEntity);
            await _context.SaveChangesAsync();
            return new PasswordEditDto { Id = dto.Id };
        }
    }
}
