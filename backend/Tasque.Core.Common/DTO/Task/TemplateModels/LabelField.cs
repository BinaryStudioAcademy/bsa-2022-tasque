using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.DTO.Task.TemplateModels
{
    public class LabelField : BaseTemplate
    {
        public string Name { get; set; } = null!;

        public string? Color { get; set; }
    }
}
