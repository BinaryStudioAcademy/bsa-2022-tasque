namespace Tasque.Core.Identity.Exeptions
{
    public class InvalidTokenException : Exception
    {
        public InvalidTokenException(string message) : base(message)
        {

        }
    }
}
