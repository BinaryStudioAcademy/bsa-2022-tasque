using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.DTO.Task
{
    public class TaskTypeDto
    {
        public int Id { get; set; }
        public int ProjectId { get; set; }
        public string Name { get; set; } = null!;
    }
}
