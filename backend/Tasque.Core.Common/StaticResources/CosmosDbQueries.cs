using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.StaticResources
{
    public static class CosmosDbQueries
    {
        public const string GetAllTasks = "SELECT * FROM c";
    }
}
