using RabbitMQ.Client;

namespace Tasque.Messaging.Connections
{
    public interface IPersistentConnection : IDisposable
    {
        bool IsConnected { get; }
        bool TryConnect();
        IModel CreateModel();
    }
}
