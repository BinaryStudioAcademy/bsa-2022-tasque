namespace Tasque.Core.Common.Entities.Abstract;

public class BaseEntity
{
    public BaseEntity()
    {
        CreatedAt = UpdatedAt = DateTime.Now;
    }

    public int Id { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
