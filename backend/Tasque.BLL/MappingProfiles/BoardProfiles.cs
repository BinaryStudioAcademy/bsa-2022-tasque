using AutoMapper;
using Tasque.Core.Common.DTO.Board;
using Tasque.Core.Common.DTO.Organization;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.BLL.MappingProfiles
{
    public class BoardProfiles : Profile
    {
        public BoardProfiles()
        {
            CreateMap<Board, BoardDto>().ReverseMap();
        }
    }
}
