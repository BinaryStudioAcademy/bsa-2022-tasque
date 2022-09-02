namespace Tasque.Core.Common.DTO.Task
{
    public class TaskInfoDto
    {
        public int Id { get; set; }
        public string Description { get; set; } = null!;
        public string ProjectKey { get; set; } = null!;
        public string? UserAvatarUrl { get; set; }
        public string? AttachmentUrl { get; set; }
    }
}
