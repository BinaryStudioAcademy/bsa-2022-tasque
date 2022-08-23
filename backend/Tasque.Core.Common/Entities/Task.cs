using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Task : BaseEntity
{
    public Task()
    {
        Attachments = new List<Attachment>();
        Labels = new List<Label>();
        Users = new List<User>();
    }
    public string Summary { get; set; } = null!;
    public string? Description { get; set; }

    public DateTime Deadline { get; set; }
    public DateTime? FinishedAt { get; set; }

    public int StateId { get; set; }
    public TaskState State { get; set; } = null!;

    public int TypeId { get; set; }
    public TaskType Type { get; set; } = null!;

    public int PriorityId { get; set; }
    public TaskPriority Priority { get; set; } = null!;

    public int AuthorId { get; set; }
    public User Author { get; set; } = null!;

    public int ProjectId { get; set; }
    public Project Project { get; set; } = null!;

    public int? BoardColumnId { get; set; }
    public BoardColumn? BoardColumn { get; set; }

    public int? SprintId { get; set; }
    public Sprint? Sprint { get; set; }

    public int? LastUpdatedById { get; set; }
    public User? LastUpdatedBy { get; set; }

    public int? ParentTaskId { get; set; }
    public Task? ParentTask { get; set; }

    public virtual ICollection<Attachment> Attachments { get; set; }
    public virtual ICollection<Label> Labels { get; set; }
    public virtual ICollection<User> Users { get; set; }
}

