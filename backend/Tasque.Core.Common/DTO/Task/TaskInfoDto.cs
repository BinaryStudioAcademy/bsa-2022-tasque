using Tasque.Core.Common.DTO.User;

namespace Tasque.Core.Common.DTO.Task
{
    public class TaskInfoDto
    {
        public int Id { get; set; }
        public string Summary { get; set; } = null!;
        public string Description { get; set; } = null!;
        public string? Key { get; set; }
        public int Order { get; set; }
        public UserDto? Author { get; set; }
        public string? AttachmentUrl { get; set; }
        public int? StateId { get; set; }
        public TaskStateDto? State { get; set; }
        public int TypeId { get; set; }
        public TaskTypeDto? Type { get; set; }
        public int? PriorityId { get; set; }
        public TaskPriorityDto? Priority { get; set; }
    }
}
