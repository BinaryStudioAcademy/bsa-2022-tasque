using System.Text.RegularExpressions;

namespace Tasque.Core.Common
{
    public static class Constants
    {
        public static readonly Regex EMAIL_REGEX = new(@"^((?![_.+%-])(?:(?<=[_.+%-])\w|(?<![_.+%-])[\w.+%-]){1,64}(?<![_.+%-]))@((?:(?![_.+%-])(?:(?<=[_.-])[a-z0-9]|(?<![_.-])[a-z0-9._-]){1,63}(?<![_.+%-]))\.[a-z]{2,4})$");
    }
}
