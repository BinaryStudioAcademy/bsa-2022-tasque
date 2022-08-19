using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.BLL.Exeptions
{
    public class AwsException : Exception
    {
        public AwsException(string message) : base(message) { }
    }
}
