using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Comment : BaseEntity
{
    public string Message { get; set; } = "";

    public int AuthorId { get; set; }
    public User Author { get; set; }

    public int TaskId { get; set; }
    public Task Task { get; set; }
}
