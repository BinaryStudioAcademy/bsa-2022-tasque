using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.DTO.Task
{
    public class TaskDto
    {
        public string Summary { get; set; } = null!;
        public string? Description { get; set; }
        public DateTime Deadline { get; set; }
        public DateTime? FinishedAt { get; set; }
        public int StateId { get; set; }
        public int TypeId { get; set; }
        public int PriorityId { get; set; }
        public int AuthorId { get; set; }
        public int ProjectId { get; set; }
        public int? BoardColumnId { get; set; }
        public int? SprintId { get; set; }
        public int? LastUpdatedById { get; set; }
        public int? ParentTaskId { get; set; }

        public int? Estimate { get; set; }
    }
}
