using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Board : BaseEntity
{
    public string Name { get; set; } = "";

    public int ProjectId { get; set; }
    public Project Project { get; set; }
}
