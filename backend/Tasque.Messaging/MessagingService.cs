using Microsoft.Extensions.Configuration;
using Newtonsoft.Json;
using RabbitMQ.Client;
using RabbitMQ.Client.Events;
using System.Text;

namespace Tasque.Messaging
{
    public class MessagingService : IMessagingService
    {
        private readonly ConnectionFactory _factory;
        public MessagingService(string hostName)
        {
            _factory = new ConnectionFactory()
            {
                HostName = hostName
            };
        }

        public void Publish<TBody>(TBody content, string routingKey) where TBody : class
        {
            using (var connection = _factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.ExchangeDeclare(exchange: Constants.Notifications.Exchange, type: ExchangeType.Direct);
                string message = JsonConvert.SerializeObject(content);
                var body = Encoding.UTF8.GetBytes(message);
                channel.BasicPublish(exchange: Constants.Notifications.Exchange, routingKey: routingKey, basicProperties: null, body: body);
            }
        }

        public void Subscribe<TBody>(string routingKey, Func<TBody, Task> callback) where TBody : class
        {
            using (var connection = _factory.CreateConnection())
            using (var channel = connection.CreateModel())
            {
                channel.ExchangeDeclare(exchange: Constants.Notifications.Exchange, type: ExchangeType.Direct);
                var queueName = channel.QueueDeclare().QueueName;

                channel.QueueBind(queue: queueName, exchange: Constants.Notifications.Exchange, routingKey: routingKey);

                var consumer = new EventingBasicConsumer(channel);
                consumer.Received += async (model, ea) =>
                {
                    var body = ea.Body.ToArray();
                    var message = Encoding.UTF8.GetString(body);
                    var routingKey = ea.RoutingKey;
                    var entity = JsonConvert.DeserializeObject<TBody>(message);
                    await callback(entity!);

                };
                channel.BasicConsume(queue: queueName, autoAck: true, consumer: consumer);
            }
        }
    }
}