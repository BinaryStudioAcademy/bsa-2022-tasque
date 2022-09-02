using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Enums;

namespace Tasque.Core.Common.DTO.Task.TemplateModels
{
    public class CosmosTemplateCustomField
    {
        public string? Name { get; set; }

        public TaskFieldType Type { get; set; }

        public string? Content { get; set; }
    }
}
