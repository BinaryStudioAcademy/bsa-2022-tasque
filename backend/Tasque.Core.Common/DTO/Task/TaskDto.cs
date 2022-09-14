using Tasque.Core.Common.DTO.PartialModels;
using Tasque.Core.Common.DTO.Project;
using Tasque.Core.Common.DTO.Task.PartialModels;
using Tasque.Core.Common.DTO.User;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Enums;
using Task = Tasque.Core.Common.Entities.Task;

namespace Tasque.Core.Common.DTO.Task
{
    public class TaskDto
    {
        public int Id { get; set; }
        public string? Description { get; set; }
        public string Summary { get; set; } = null!;
        public string? Key { get; set; }
        public int Order { get; set; }

        public int StateId { get; set; }
        public TaskStateDto? State { get; set; }
        public int TypeId { get; set; }
        public TaskTypeDto? Type { get; set; }
        public int PriorityId { get; set; }
        public TaskPriorityDto? Priority { get; set; }

        public DateTime Deadline { get; set; }
        public DateTime? FinishedAt { get; set; }

        public int AuthorId { get; set; }

        public int ProjectId { get; set; }

        public int? BoardColumnId { get; set; }

        public int? SprintId { get; set; }

        public int? LastUpdatedById { get; set; }

        public int? ParentTaskId { get; set; }

        public int? Estimate { get; set; }

        public virtual ICollection<AttachmentDto>? Attachments { get; set; }
        public virtual ICollection<LabelDto>? Labels { get; set; }
        public virtual ICollection<UserDto>? Users { get; set; }

        public List<TaskCustomFields>? CustomFields { get; set; }
        public TaskDto()
        {
            Attachments = new List<AttachmentDto>();
            Labels = new List<LabelDto>();
            Users = new List<UserDto>();
        }
    }
}
