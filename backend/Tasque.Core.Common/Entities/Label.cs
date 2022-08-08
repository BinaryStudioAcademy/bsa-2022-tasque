using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Label : BaseEntity
{
    public string Name { get; set; } = "";

    public int ProjectId { get; set; }
    public Project Project { get; set; }

    public virtual ICollection<Task> Tasks { get; set; }
}
