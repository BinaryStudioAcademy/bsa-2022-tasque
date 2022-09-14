using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class TaskType : BaseEntity, IBaseEntity
{
    public TaskType()
    {
        Tasks = new List<Task>();
    }
    public string Name { get; set; } = null!;

    public string? Color { get; set; }

    public int ProjectId { get; set; }
    
    public Project Project { get; set; }

    public virtual ICollection<Task> Tasks { get; set; }
}
