﻿using System;
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
        public virtual ICollection<int> UsersId { get; set; }

        public CustomTaskAttributes? CustomFields { get; set; }

        public TaskDto() 
        {
            Attachments = new List<Attachment>();
            Labels = new List<Label>();
            UsersId = new List<int>();
        }
    }
}
