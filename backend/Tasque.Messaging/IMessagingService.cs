using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Messaging
{
    public interface IMessagingService
    {
        void Publish<TBody>(TBody content, string routingKey) where TBody : class;
        void Subscribe<TBody>(string routingKey, Func<TBody, Task> callback) where TBody : class;
    }
}
