using Microsoft.Extensions.DependencyInjection;
using Tasque.Core.Identity.Services.Abstraction;
using Tasque.Core.Identity.Services.Implementation;

namespace Tasque.Core.Identity
{
    public static class Registrations
    {
        public static void RegisterIdentity(this IServiceCollection services)
        {
            services.AddScoped<IUserService, UserService>();
        }
    }
}