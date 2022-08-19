using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.DTO.PartialModels;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Enums;

namespace Tasque.Core.Common.DTO
{
    public class TaskDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Description { get; set; }
        public string Summary { get; set; } = null!;

        public TaskState State { get; set; }
        public TaskType Type { get; set; }
        public TaskPriority Priority { get; set; }

        public DateTime Deadline { get; set; }
        public DateTime? FinishedAt { get; set; }

        public int AuthorId { get; set; }
        public int ProjectId { get; set; }
        public int? BoardColumnId { get; set; }
        public int? SprintId { get; set; }
        public int? LastUpdatedById { get; set; }
        public int? ParentTaskId { get; set; }

        public virtual ICollection<Attachment> Attachments { get; set; }
        public virtual ICollection<Label> Labels { get; set; }
        public virtual ICollection<User> Users { get; set; }

        public CustomTaskAttributes? CustomFields { get; set; }

        public TaskDto() 
        {
            Attachments = new List<Attachment>();
            Labels = new List<Label>();
            Users = new List<User>();
        }

        public TaskDto(TaskDto t, CustomAwsTaskAttributes ca)
        {
            Id = t.Id;
            Name = t.Name;
            Description = t.Description;
            Summary = t.Summary;

            State = t.State;
            Type = t.Type;
            Priority = t.Priority;

            Deadline = t.Deadline;
            FinishedAt = t.FinishedAt;

            AuthorId = t.AuthorId;
            ProjectId = t.ProjectId;
            BoardColumnId = t.BoardColumnId;
            SprintId = t.SprintId;
            LastUpdatedById = t.LastUpdatedById;
            ParentTaskId = t.ParentTaskId;

            Attachments = new List<Attachment>();
            Labels = new List<Label>();
            Users = new List<User>();

            CustomFields = new()
            {
                CustomDateFields = ca?.CustomDateFields,
                CustomTextFields = ca?.CustomTextFields,
                CustomParagraphFilds = ca?.CustomParagraphFilds,
                CustomNumberFields = ca?.CustomNumberFields,

                CustomCheckboxFields = ca?.CustomCheckboxFields,
                CustomDropdownFields = ca?.CustomDropdownFields,
                CustomDropdownDependenciesFields = ca?.CustomDropdownDependenciesFields,
            };
        }
    }
}
