using System.Text.RegularExpressions;

namespace Tasque.Core.Common
{
    public static class Constants
    {
        public static readonly Regex EMAIL_REGEX = new(@"^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$");
    }
}
