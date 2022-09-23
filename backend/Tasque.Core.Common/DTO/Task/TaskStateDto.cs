namespace Tasque.Core.Common.DTO.Task;

public class TaskStateDto
{
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string Name { get; set; } = null!;
    public string? Color { get; set; }
    public bool? Status { get; set; }
}
