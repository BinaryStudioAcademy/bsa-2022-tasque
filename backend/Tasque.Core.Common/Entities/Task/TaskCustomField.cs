using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.Entities.Task
{
    public class TaskCustomField
    {

        public string Name { get; set; }

        public int Type { get; set; }

        public List<LabelField>? Labels { get; set; }

        public DropdownField? Dropdown { get; set; }
    }
}
