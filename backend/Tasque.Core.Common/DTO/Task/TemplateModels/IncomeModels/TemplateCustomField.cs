using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.DTO.Task.TemplateModels.AdditionModels;
using Tasque.Core.Common.Enums;

namespace Tasque.Core.Common.DTO.Task.TemplateModels.IncomeModels
{
    public class TemplateCustomField
    {
        public Guid FieldId { get; set; } = Guid.NewGuid();

        public string? Name { get; set; }

        public TaskFieldType Type { get; set; }

        public DropdownField? Dropdown { get; set; }

        public List<LabelField>? Labels { get; set; }

        public List<CheckboxField>? Checkboxes { get; set; }
    }
}
