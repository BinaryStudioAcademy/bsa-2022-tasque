using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Enums;

namespace Tasque.Core.Common.DTO.Task.PartialModels
{
    public class TaskCustomFields
    {
        public TaskFieldType FieldType { get; set; }
        public Guid FieldId { get; set; }
        public string? FieldName { get; set; }
        public string? FieldValue { get; set; }
    }
}
