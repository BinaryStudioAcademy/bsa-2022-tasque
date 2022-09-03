using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Enums;

namespace Tasque.Core.Common.DTO.PartialModels
{
    public class CosmosTaskFields
    {
        public TaskFieldType FieldType { get; set; }
        public string? FieldValue { get; set; }
    }
}
