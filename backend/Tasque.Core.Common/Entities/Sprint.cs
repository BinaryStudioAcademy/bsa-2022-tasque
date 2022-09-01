using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Sprint : BaseEntity
{
    public Sprint()
    {
        Tasks = new List<Task>();
    }

    public string Name { get; set; } = null!;
    public string? Description { get; set; }
    public DateTime? StartAt { get; set; }
    public DateTime? EndAt { get; set; }
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
    public bool IsComplete { get; set; } = false;

    public virtual ICollection<Task> Tasks { get; set; }
}
