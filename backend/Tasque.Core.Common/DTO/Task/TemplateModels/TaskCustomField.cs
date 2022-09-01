using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Enums;

namespace Tasque.Core.Common.DTO.Task.TemplateModels
{
    public class TaskCustomField
    {
        public string? Name { get; set; }

        public TaskFieldType Type { get; set; }

        public DropdownField? Dropdown { get; set; }

        public List<LabelField>? Labels { get; set; }
    }
}
