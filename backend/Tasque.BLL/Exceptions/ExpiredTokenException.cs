namespace Tasque.Core.BLL.Exceptions
{
    public class ExpiredTokenException : Exception
    {
        public ExpiredTokenException() : base("Expired token")
        {

        }
    }
}
