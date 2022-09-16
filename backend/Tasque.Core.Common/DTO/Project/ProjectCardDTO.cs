namespace Tasque.Core.Common.DTO.Project
{
    public class ProjectCardDTO
    {
        public int ProjectId { get; set; }
        public string Title { get; set; } = null!;
        public string? Color { get; set; }
        public int AssignedIssuesCount { get; set; }
        public int AllIssuesCount { get; set; }
    }
}
