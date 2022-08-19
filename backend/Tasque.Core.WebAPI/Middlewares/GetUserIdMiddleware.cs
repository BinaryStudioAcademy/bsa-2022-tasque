using System.Security.Claims;
using Tasque.Core.BLL.Helpers;

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
            var userId = httpContext.User.FindFirst("id")?.Value;
            currentUserParameters.Id = userId;

            await _next(httpContext);
        }
    }
}
