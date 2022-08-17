using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.BLL.Exeptions
{
    public class NotFoundException : Exception
    {
        public NotFoundException(string entity) : base($"Entity {entity} not found") { }
    }
}
