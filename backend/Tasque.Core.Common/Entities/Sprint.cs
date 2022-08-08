using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Sprint : BaseEntity
{
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
}
