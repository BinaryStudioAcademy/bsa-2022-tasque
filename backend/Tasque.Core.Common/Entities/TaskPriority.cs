using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class TaskPriority : BaseEntity
{
    public TaskPriority()
    {
        Tasks = new List<Task>();
    }

    public string Name { get; set; } = null!;

    public int ProjectId { get; set; }

    public string? Color { get; set; }

    public Project? Project { get; set; }

    public virtual ICollection<Task> Tasks { get; set; }
}
