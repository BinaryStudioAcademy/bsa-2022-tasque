using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.DTO.PartialModels.TaskEntity
{
    public class TaskCustomFields<T>
    {
        public T[] FieldValues { get; set; }
    }
}
