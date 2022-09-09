using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Enums;

namespace Tasque.Core.Common.DTO.Task
{
    public class TaskPriorityDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public int projectId { get; set; }

        public BasicTaskPriorityTypes Type { get; set; }
    }
}
