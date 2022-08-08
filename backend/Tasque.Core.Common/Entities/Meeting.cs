using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Meeting : BaseEntity
{
    public DateTime StartingTime { get; set; }
    public DateTime EndingTime { get; set; }

    public int CalendarId { get; set; }
    public Calendar Calendar { get; set; }

    public virtual ICollection<User> Users { get; set; }
}
