using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class BoardColumn : BaseEntity, IBaseEntity
{
    public BoardColumn()
    {
        Tasks = new List<Task>();
    }
    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
    public string Name { get; set; } = null!;
    public virtual ICollection<Task> Tasks { get; set; }
}
