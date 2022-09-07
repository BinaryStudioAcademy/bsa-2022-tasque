using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Routing;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Notifications.Hubs;

namespace Tasque.Notifications
{
    public static class Registrations
    {
        public static IEndpointRouteBuilder MapHubs(this IEndpointRouteBuilder cfg)
        {
            cfg.MapHub<TaskCommentedHub>("/taskcommented");
            cfg.MapHub<TaskMovedHub>("/taskmoved");
            cfg.MapHub<UserInvitedHub>("/userinvited");
            return cfg;
        }
    }
}
