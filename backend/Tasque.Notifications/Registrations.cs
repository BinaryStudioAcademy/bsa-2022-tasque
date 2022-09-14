using Tasque.Core.Common.Entities.Notifications;
using Tasque.Notifications.Hubs;
using Tasque.Notifications.Services;

namespace Tasque.Notifications
{
    public static class Registrations
    {
        public static void AddServices(this IServiceCollection services)
        {
            services.AddTransient<NotificationsService<TaskCommentedNotification>>();
            services.AddTransient<NotificationsService<TaskMovedNotification>>();
            services.AddTransient<NotificationsService<UserInvitedNotification>>();
        }

        public static void ConfigureSignalR(this IServiceCollection services)
        {
            services.AddSignalR();
            services.AddSingleton<NotificationsHub>();
        }
    }
}
