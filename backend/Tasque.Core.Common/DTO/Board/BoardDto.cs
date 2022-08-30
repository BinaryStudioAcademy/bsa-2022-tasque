using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.DTO.Board
{
    public class BoardDto
    {
        public string Name { get; set; } = null!;
        public int ProjectId { get; set; }
    }
}
