using System.Net;
using System.Runtime.Serialization;

namespace Tasque.Core.BLL.Exeptions
{
    [Serializable]
    public class HttpException : ApplicationException
    {
        public virtual HttpStatusCode StatusCode { get; set; }
        public HttpException() { }

        public HttpException(HttpStatusCode statusCode, string message)
            : base(message)
        {
            StatusCode = statusCode;
        }

        public HttpException(string message, Exception inner)
            : base(message, inner) { }

        protected HttpException(SerializationInfo info, StreamingContext context)
            : base(info, context) { }
    }
}
