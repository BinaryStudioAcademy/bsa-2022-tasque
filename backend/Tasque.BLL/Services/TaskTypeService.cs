using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services
{
    public class TaskTypeService : EntityCrudService<TaskType>
    {
        public TaskTypeService(DataContext db) : base(db)
        {

        }
    }
}
