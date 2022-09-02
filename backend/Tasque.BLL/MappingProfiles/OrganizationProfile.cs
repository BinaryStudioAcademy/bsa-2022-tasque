using AutoMapper;
using Tasque.Core.Common.DTO.Organization;
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
