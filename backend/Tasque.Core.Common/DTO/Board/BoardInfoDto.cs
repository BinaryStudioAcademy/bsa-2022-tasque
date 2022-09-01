namespace Tasque.Core.Common.DTO.Board
{
    public class BoardInfoDto
    {
        public string Name { get; set; } = null!;
        public List<BoardColumnDto>? Column { get; set; }
    }
}
