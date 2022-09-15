using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Label : BaseEntity
{
    public Label()
    {
        Tasks = new List<Task>();
    }

    public string Name { get; set; } = null!;

    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    public virtual ICollection<Task> Tasks { get; set; }
}
