using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.PartialModels
{
    public class CreateOrganization
    {
        public string? Name { get; set; }

        public int AuthorId { get; set; }
    }
}
