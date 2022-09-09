using Tasque.Core.Common.Entities.Abstract;
using Tasque.Core.Common.Enums;

namespace Tasque.Core.Common.Entities;

public class TaskPriority : BaseEntity
{
    public TaskPriority()
    {
        Tasks = new List<Task>();
    }

    public string Name { get; set; } = null!;

    public int projectId { get; set; } 

    public BasicTaskPriorityTypes Type { get; set; }

    public virtual ICollection<Task> Tasks { get; set; }
}
