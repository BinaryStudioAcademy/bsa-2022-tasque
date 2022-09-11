using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Models;
using Task = Tasque.Core.Common.Entities.Task;

namespace Tasque.Core.Common.Models.Events
{
    public class TaskMovedEvent : IntegrationEvent
    {
        public int PreviousColumnId { get; set; }
        public int NewColumnId { get; set; }
        public int TaskId { get; set; }
        public string authorName { get; set; }
    }
}
