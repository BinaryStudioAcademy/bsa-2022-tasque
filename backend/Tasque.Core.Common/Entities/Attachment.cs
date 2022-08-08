using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Attachment : BaseEntity
{
    public Attachment()
    {
        Tasks = new List<Task>();
    }
    public string URL { get; set; } = null!;
    public virtual ICollection<Task> Tasks { get; set; }
}
