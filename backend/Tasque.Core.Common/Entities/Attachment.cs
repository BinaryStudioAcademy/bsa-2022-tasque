using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Attachment : BaseEntity
{
    public string URL { get; set; } = "";

    public virtual ICollection<Task> Tasks { get; set; }
}
