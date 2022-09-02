using Tasque.Core.Common.DTO.Task;

namespace Tasque.Core.Common.DTO.Board
{
    public class BoardColumnDto
    {
        public int Id { get; set; }
        public string ColumnName { get; set; } = null!;
        public List<TaskInfoDto>? Tasks { get; set; }
    }
}
