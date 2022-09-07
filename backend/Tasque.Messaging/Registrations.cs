using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Messaging
{
    public static class Registrations
    {
        public static IServiceCollection AddMessaging(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddSingleton<IMessagingService>(options => new MessagingService(configuration["ConnectionStrings:RabbitMQ"]));
            return services;
        }
    }
}
