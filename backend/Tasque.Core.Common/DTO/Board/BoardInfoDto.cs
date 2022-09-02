namespace Tasque.Core.Common.DTO.Board
{
    public class BoardInfoDto
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string Name { get; set; } = null!;
        public List<BoardColumnDto>? Columns { get; set; }
    }
}
