using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Models;
using Task = Tasque.Core.Common.Entities.Task;

namespace Tasque.Notifications.Events
{
    public class TaskMovedEvent : IntegrationEvent
    {
        public BoardColumn PreviousColumn { get; set; }
        public BoardColumn NewColumn { get; set; }
        public Task Task { get; set; }
        public string authorName { get; set; }
    }
}
