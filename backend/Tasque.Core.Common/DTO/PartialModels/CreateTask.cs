using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Enums;

namespace Tasque.Core.Common.DTO.PartialModels
{
    public class CreateTask
    {
        public string Name { get; set; } = null!;
        public string? Description { get; set; }

        public TaskState State { get; set; }
        public TaskType Type { get; set; }
        public TaskPriority Priority { get; set; }

        public int AuthorId { get; set; }
        public int ProjectId { get; set; }

        public int? SprintId { get; set; }
        public int? BoardColumnId { get; set; }
        public int? LastUpdatedById { get; set; }
        public int? ParentTaskId { get; set; }

        public CustomAwsTaskAttributes? CustomFields { get; set; }
    }
}
