﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.DTO.Task
{
    public class TaskStateDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Color { get; set; }
        public int ProjectId { get; set; }
    }
}
