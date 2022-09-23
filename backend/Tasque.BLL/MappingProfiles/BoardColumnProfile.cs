using AutoMapper;
using Tasque.Core.Common.DTO.Board;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.BLL.MappingProfiles;
public class BoardColumnProfile : Profile
{
	public BoardColumnProfile()
	{
		CreateMap<BoardColumn, BoardColumnDto>().ReverseMap();
	}
}
