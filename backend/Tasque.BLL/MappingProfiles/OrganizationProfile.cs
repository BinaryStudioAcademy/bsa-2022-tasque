using AutoMapper;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.PartialModels;

namespace Tasque.Core.BLL.MappingProfiles
{
    public class OrganizationProfile : Profile
    {
        public OrganizationProfile()
        {
            CreateMap<CreateOrganization, Organization>();
            CreateMap<Organization, OrganizationDto>().ReverseMap();
        }
    }
}
