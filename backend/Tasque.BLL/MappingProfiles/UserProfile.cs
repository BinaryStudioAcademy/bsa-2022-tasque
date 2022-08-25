using AutoMapper;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.DTO.User;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.BLL.MappingProfiles
{
    public class UserProfile : Profile
    {
        public UserProfile()
        {
            CreateMap<UserRegisterDto, User>();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<User, UserInfoDto>();
        }
    }
}
