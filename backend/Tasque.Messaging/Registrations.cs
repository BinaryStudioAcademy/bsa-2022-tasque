using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using RabbitMQ.Client;
using Tasque.Messaging.Abstractions;
using Tasque.Messaging.Connections;
using Tasque.Messaging.SubscriptionManagement;

namespace Tasque.Messaging
{
    public static class Registrations
    {
        public static IServiceCollection RegisterEventBus(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<ISubscriptionsManager, InMemorySubscriptionsManager>();
            services.AddBusConnection(configuration);
            services.AddBus(configuration);
            return services;
        }

        private static void AddBusConnection(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IPersistentConnection>(sp =>
            {
                var logger = sp.GetRequiredService<ILogger<PersistentConnection>>();

                var factory = new ConnectionFactory()
                {
                    HostName = configuration["ConnectionStrings:EventBus"],
                    DispatchConsumersAsync = true
                };

                if (!string.IsNullOrEmpty(configuration["EventBusUserName"]))
                {
                    factory.UserName = configuration["EventBusUserName"];
                }

                if (!string.IsNullOrEmpty(configuration["EventBusPassword"]))
                {
                    factory.Password = configuration["EventBusPassword"];
                }

                var retryCount = 5;
                if (!string.IsNullOrEmpty(configuration["EventBusRetryCount"]))
                {
                    retryCount = int.Parse(configuration["EventBusRetryCount"]);
                }

                return new PersistentConnection(factory, logger, retryCount);
            });
        }

        private static void AddBus(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IEventBus, EventBus>(provider =>
            {
                var rabbitMQPersistentConnection = provider.GetRequiredService<IPersistentConnection>();
                var logger = provider.GetRequiredService<ILogger<EventBus>>();
                var eventBusSubcriptionsManager = provider.GetRequiredService<ISubscriptionsManager>();

                var retryCount = 5;
                if (!string.IsNullOrEmpty(configuration["EventBusRetryCount"]))
                {
                    retryCount = int.Parse(configuration["EventBusRetryCount"]);
                }

                return new EventBus(rabbitMQPersistentConnection, logger, provider, eventBusSubcriptionsManager, retryCount);
            });
        }
    }
}
