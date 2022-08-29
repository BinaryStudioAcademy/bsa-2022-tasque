using AutoMapper;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
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
        }
    }
}
