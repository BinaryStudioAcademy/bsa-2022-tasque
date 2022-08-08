using Tasque.Core.Common.Entities.Abstract;
using Tasque.Core.Common.Enums;

namespace Tasque.Core.Common.Entities;

public class Task : BaseEntity
{
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public string Summary { get; set; } = "";

    public TaskState State { get; set; }
    public TaskType Type { get; set; }
    public TaskPriority Priority { get; set; }

    public DateTime Deadline { get; set; }
    public DateTime? FinishedAt { get; set; }

    public int AuthorId { get; set; }
    public User Author { get; set; }

    public int ProjectId { get; set; }
    public Project Project { get; set; }

    public int BoardColumnId { get; set; }
    public BoardColumn BoardColumn { get; set; }

    public int? SprintId { get; set; }
    public Sprint Sprint { get; set; }

    public int? LastUpdatedById { get; set; }
    public User LastUpdatedBy { get; set; }

    public int? ParentTaskId { get; set; }
    public Task? ParentTask { get; set; }

    public virtual ICollection<Attachment> Attachments { get; set; }
    public virtual ICollection<Label> Labels { get; set; }
    public virtual ICollection<User> Users { get; set; }
}

