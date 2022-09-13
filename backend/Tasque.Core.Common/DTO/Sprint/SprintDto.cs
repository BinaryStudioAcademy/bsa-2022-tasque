namespace Tasque.Core.Common.DTO.Sprint;

public class SprintDto
{
    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime? StartAt { get; set; }
    public DateTime? EndAt { get; set; }
    public int ProjectId { get; set; }
    public bool isComplete { get; set; }
    public int Order { get; set; }
}
