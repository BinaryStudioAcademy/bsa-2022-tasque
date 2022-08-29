using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class TaskType : BaseEntity
{
    public TaskType()
    {
        //Tasks = new List<Task>();
    }
    public string Name { get; set; } = null!;

    //public virtual ICollection<Task> Tasks { get; set; }
}
