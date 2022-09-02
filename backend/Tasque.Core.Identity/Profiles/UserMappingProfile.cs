using AutoMapper;
<<<<<<< HEAD
using Tasque.Core.Common.DTO;
=======
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
>>>>>>> dev
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
