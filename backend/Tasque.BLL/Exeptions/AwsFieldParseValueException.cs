using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.BLL.Exeptions
{
    public class AwsFieldParseValueException : Exception
    {
        public AwsFieldParseValueException(string message) : base(message) { }
    }
}
