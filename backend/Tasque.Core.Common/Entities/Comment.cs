using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Comment : BaseEntity, IBaseEntity
{
    public string Message { get; set; } = null!;

    public int AuthorId { get; set; }
    public User Author { get; set; } = null!;

    public int TaskId { get; set; }
    public Task Task { get; set; } = null!;
}
