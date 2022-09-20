namespace Tasque.Core.Common.DTO.Task
{
    public class TaskPriorityDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public int ProjectId { get; set; }
        public string? Color { get; set; }
    }
}
