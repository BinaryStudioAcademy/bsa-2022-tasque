using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.BLL.Options
{
    public class CosmosDbOptions
    {
        public string DatabaseName { get; set; } = null!;

        public string TaskContainer { get; set; } = null!;

        public string TaskContainerDev { get; set; } = null!;

        public string TemplateContainer { get; set; } = null!;

        public string TemplateContainerDev { get; set; } = null!;

        public string Account { get; set; } = null!;

        public string Key { get; set; } = null!;
    }
}
