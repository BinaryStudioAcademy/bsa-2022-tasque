﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.Entities.Task
{
    public class TaskTemplate
    {
        public int Id { get; set; }

        public List<TaskCustomField> ContextFields { get; set; }

        public List<TaskCustomField> FieldsWithDescription { get; set; }
    }
}
