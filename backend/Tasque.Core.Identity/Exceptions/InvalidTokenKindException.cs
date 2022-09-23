using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Identity.Exceptions
{
    public sealed class InvalidTokenKindException : Exception
    {
        public InvalidTokenKindException() : base("Invalid token kind") { }
    }
}
