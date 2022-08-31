using AutoMapper;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.BLL.MappingProfiles
{
    public class SprintProfiles : Profile
    {
        public SprintProfiles()
        {
            CreateMap<Sprint, SprintDto>().ReverseMap();
        }
    }
}
