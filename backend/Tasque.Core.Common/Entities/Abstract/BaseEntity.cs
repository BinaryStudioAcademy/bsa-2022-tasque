namespace Tasque.Core.Common.Entities.Abstract;

public abstract class BaseEntity
{
    public BaseEntity()
    {
        CreatedAt = UpdatedAt = DateTime.UtcNow;
    }

    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
