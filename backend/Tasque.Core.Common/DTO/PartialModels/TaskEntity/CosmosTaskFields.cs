using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Enums;

namespace Tasque.Core.Common.DTO.PartialModels.TaskEntity
{
    public class CosmosTaskFields
    {
        public TaskFieldType FieldType { get; set; }
        public TaskCustomFields<string>[]? FieldValues { get; set; }
    }
}
 