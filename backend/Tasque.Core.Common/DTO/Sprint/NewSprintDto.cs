using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.DTO.Sprint
{
    public class NewSprintDto
    {
        public string Name { get; set; } = null!;
        public int ProjectId { get; set; }
        public int AuthorId { get; set; }
    }
}
