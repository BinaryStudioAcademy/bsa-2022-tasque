using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.Entities.Notifications;
using Tasque.Core.Common.Models.Events;
using Tasque.Messaging;
using Tasque.Messaging.Abstractions;
using Tasque.Notifications.Data;
using Tasque.Notifications.Handlers;
using Tasque.Notifications.Hubs;
using Tasque.Notifications.Services;

namespace Tasque.Notifications
{
    public static class Registrations
    {
        public static void RegisterInfrastructure(this IServiceCollection services, IConfiguration configuration)
        {
            services.AddDbContext<NotificationsContext>(
                o => o.UseNpgsql(configuration["ConnectionStrings:NotificationsDb"],
                    b => b.MigrationsAssembly(typeof(NotificationsContext).Assembly.FullName))
                    .EnableDetailedErrors());

            services.RegisterEventBus(configuration);
            services.RegisterHandlers();
            services.RegisterServices();
            services.ConfigureSignalR();
        }

        public static void ConfigureSubscriptions(this IServiceProvider provider)
        {
            var bus = provider.GetRequiredService<IEventBus>();

            bus.Subscribe<UserInvitedEvent, UserInvitedEventHandler>();
            bus.Subscribe<TaskCommentedEvent, TaskCommentedEventHandler>();
            bus.Subscribe<TaskMovedEvent, TaskMovedEventHandler>();
        }
        private static void RegisterServices(this IServiceCollection services)
        {
            services.AddTransient<NotificationsService<TaskCommentedNotification>>();
            services.AddTransient<NotificationsService<TaskMovedNotification>>();
            services.AddTransient<NotificationsService<UserInvitedNotification>>();
        }

        private static void ConfigureSignalR(this IServiceCollection services)
        {
            services.AddSignalR();
            services.AddSingleton<NotificationsHub>();
        }

        private static void RegisterHandlers(this IServiceCollection services)
        {
            services.AddSingleton<UserInvitedEventHandler>();
            services.AddSingleton<TaskCommentedEventHandler>();
            services.AddSingleton<TaskMovedEventHandler>();
        }
    }
}
