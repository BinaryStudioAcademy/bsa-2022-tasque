using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.DTO
{
    public class OrganizationDto
    {
        public int Id { get; set; }

        public string Name { get; set; } = null!;

        public int AuthorId { get; set; }
    }
}
