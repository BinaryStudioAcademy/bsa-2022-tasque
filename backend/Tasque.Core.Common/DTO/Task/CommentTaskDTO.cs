using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.Common.DTO.Task
{
    public class CommentTaskDTO
    {
        public int TaskId { get; set; }
        public Comment Comment { get; set; }
    }
}
