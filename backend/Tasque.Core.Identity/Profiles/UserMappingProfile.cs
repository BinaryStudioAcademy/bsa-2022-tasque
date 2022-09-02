using AutoMapper;
using Tasque.Core.Common.DTO.User;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.Identity.MappingProfiles
{
    public class UserMappingProfile : Profile
    {
        public UserMappingProfile()
        {
            CreateMap<UserRegisterDto, User>();
            CreateMap<User, UserDto>().ReverseMap();
            CreateMap<User, UserInfoDto>();
        }
    }
}
