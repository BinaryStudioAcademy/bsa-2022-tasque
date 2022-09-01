using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.DTO.Task.TemplateModels
{
    public class TaskTemplate
    {
        public int Id { get; set; }

        public int TypeId { get; set; }

        public int ProjectId { get; set; }

        public List<TaskCustomField>? CustomContextFields { get; set; }

        public List<TaskCustomField>? CustomDescriptionFields { get; set; }
    }
}
