using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class BoardColumn : BaseEntity
{
    public string Name { get; set; } = null!;

    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;
}
