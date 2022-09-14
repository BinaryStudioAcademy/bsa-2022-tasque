using Tasque.Core.Common.DTO.User;

namespace Tasque.Core.Common.DTO.Task
{
    public class TaskInfoDto
    {
        public int Id { get; set; }
        public string Summary { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string ProjectKey { get; set; } = null!;
        public int Order { get; set; }
        public UserDto? Author { get; set; }
        public string? AttachmentUrl { get; set; }
    }
}
