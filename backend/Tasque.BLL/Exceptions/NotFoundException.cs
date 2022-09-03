﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.BLL.Exceptions
{
    public class NotFoundException : Exception
    {
        public NotFoundException(string message) : base($"Entity {message} not found") { }
    }
}