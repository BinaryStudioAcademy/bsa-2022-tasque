using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Sprint : BaseEntity
{
    public string Name { get; set; } = null!;
    public string? Description { get; set; }
}
