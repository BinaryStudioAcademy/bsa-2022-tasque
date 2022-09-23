using System.Security.Claims;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Middlewares
{
    public class GetUserIdMiddleware
    {
        private readonly RequestDelegate _next;

        public GetUserIdMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext, CurrentUserParameters currentUserParameters)
        {
            if (int.TryParse(httpContext.User.FindFirst("id")?.Value, out int userId))
            {
                currentUserParameters.Id = userId;
            }

            await _next(httpContext);
        }
    }
}
