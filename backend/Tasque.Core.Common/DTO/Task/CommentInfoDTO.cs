using Tasque.Core.Common.DTO.User;

namespace Tasque.Core.Common.DTO.Task
{
    public class CommentInfoDTO
    {
        public int TaskId { get; set; }
        public string Message { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public UserDto? Author { get; set; }
    }
}
