using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.Models.Task
{
    public class TaskEstimateUpdate
    {
        public int TaskId { get; set; }
        public int Estimate { get; set; }
    }
}
