﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.DTO.PartialModels;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Enums;
using Task = Tasque.Core.Common.Entities.Task;

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

        public virtual ICollection<Attachment>? Attachments { get; set; }
        public virtual ICollection<Label>? Labels { get; set; }
        public virtual ICollection<User>? Users { get; set; }

        public TaskCustomFields? CustomFields { get; set; }
        public TaskDto()
        {
            Attachments = new List<Attachment>();
            Labels = new List<Label>();
            Users = new List<User>();
        }
    }
}
