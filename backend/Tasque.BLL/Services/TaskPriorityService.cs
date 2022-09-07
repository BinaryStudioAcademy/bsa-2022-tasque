using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL;

namespace Tasque.Core.BLL.Services
{
    public class TaskPriorityService : EntityCrudService<TaskPriority>
    {
        public TaskPriorityService(DataContext db) : base(db)
        {

        }
    }
}
