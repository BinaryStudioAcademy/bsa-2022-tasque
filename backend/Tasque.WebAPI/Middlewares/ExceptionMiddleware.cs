using Newtonsoft.Json;
using System.Net;
using Tasque.Core.BLL.Exeptions;

namespace Tasque.Core.WebAPI.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        public ExceptionMiddleware(RequestDelegate next)
        {
            _next = next;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (HttpException ex)
            {
                await CreateExceptionAsync(httpContext, ex.StatusCode, new { error = ex.Message });
                return;
            }
            catch (Exception)
            {
                await CreateExceptionAsync(httpContext);
                return;
            }
        }
        private async Task CreateExceptionAsync(HttpContext context, 
            HttpStatusCode statusCode = HttpStatusCode.InternalServerError,
            object? errorBody = null)
        {
            errorBody ??= new { error = "Unknown error has occured" };
            context.Response.ContentType = "application/json";
            context.Response.StatusCode = (int)statusCode;
            await context.Response.WriteAsync(JsonConvert.SerializeObject(errorBody));
        }
    }
}
