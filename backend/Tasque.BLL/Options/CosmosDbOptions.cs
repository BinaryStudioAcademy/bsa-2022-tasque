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

        public string ContainerName { get; set; } = null!;

        public string Account { get; set; } = null!;

        public string Key { get; set; } = null!;
    }
}
