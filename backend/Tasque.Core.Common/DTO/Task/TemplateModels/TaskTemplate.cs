using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Enums;
using Tasque.Core.Common.StaticResources;

namespace Tasque.Core.Common.DTO.Task.TemplateModels
{
    public class TaskTemplate
    {
        public string Id { get; set; } = null!;

        public TaskFieldType TypeId { get; set; }

        public int ProjectId { get; set; }

        public List<TemplateCustomField>? CustomFields { get; set; }
    }
}
