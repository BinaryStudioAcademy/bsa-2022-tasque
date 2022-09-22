namespace Tasque.Core.Common.DTO.Task
{
    public class CreateCommentDTO
    {
        public int TaskId { get; set; }
        public string Message { get; set; } = null!;
        public int AuthorId { get; set; }
    }
}
