using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Enums;

namespace Tasque.Core.Common.DTO.Task.TemplateModels.CosmosModels
{
    public class CosmosTemplateCustomField
    {
        public string? Name { get; set; }

        public Guid FieldId { get; init; }

        public TaskFieldType Type { get; set; }

        public string? Content { get; set; }
    }
}
