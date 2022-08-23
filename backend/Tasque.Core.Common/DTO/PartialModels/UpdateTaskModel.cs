using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.DTO.PartialModels
{
    public class UpdateTaskModel : CreateTaskModel
    {
        public int Id { get; set; }
    }
}
