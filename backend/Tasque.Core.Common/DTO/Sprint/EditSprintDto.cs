namespace Tasque.Core.Common.DTO.Sprint;

public class EditSprintDto
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime? StartAt { get; set; }
    public DateTime? EndAt { get; set; }
    public int ProjectId { get; set; }
    public bool IsStarting { get; set; }
    public int[]? Tasks { get; set; }
}
