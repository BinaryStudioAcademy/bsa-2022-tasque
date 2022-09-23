using AutoMapper;
using Tasque.Core.Common.DTO.Wiki;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.BLL.MappingProfiles
{
    public class WikiProfile : Profile
    {
        public WikiProfile()
        {
            CreateMap<WikiCreateDto, WikiPage>();
            CreateMap<WikiUpdateDto, WikiPage>();
            CreateMap<WikiPage, WikiInfoDto>();
            CreateMap<WikiPage, WikiPageDto>();
        }
    }
}
