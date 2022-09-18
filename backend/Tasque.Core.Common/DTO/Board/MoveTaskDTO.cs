using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.DTO.Board
{
    public class MoveTaskDTO
    {
        public int TaskId { get; set; }
        public int PreviousColumnId { get; set; }
        public int NewColumnId { get; set; }
        public int MovedById { get; set; }
    }
}
