using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.BLL.Exeptions
{
    public class AwsFieldPaseValueException : Exception
    {
        public AwsFieldPaseValueException(string message) : base(message) { }
    }
}
