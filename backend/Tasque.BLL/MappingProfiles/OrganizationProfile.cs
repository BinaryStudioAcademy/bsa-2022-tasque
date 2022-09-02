using AutoMapper;
<<<<<<< HEAD
using Tasque.Core.Common.DTO;
=======
using Tasque.Core.Common.DTO.Organization;
>>>>>>> dev
using Tasque.Core.Common.Entities;

namespace Tasque.Core.BLL.MappingProfiles
{
    public class OrganizationProfile : Profile
    {
        public OrganizationProfile()
        {
            CreateMap<CreateOrganizationDto, Organization>();
            CreateMap<Organization, OrganizationDto>().ReverseMap();
        }
    }
}
