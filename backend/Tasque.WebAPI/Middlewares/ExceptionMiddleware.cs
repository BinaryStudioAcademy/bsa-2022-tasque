using FluentValidation;
using Newtonsoft.Json;
using System.Net;
using Tasque.Core.BLL.Exeptions;

namespace Tasque.Core.WebAPI.Middlewares
{
    public class ExceptionMiddleware
    {
        private readonly RequestDelegate _next;
        private readonly ILogger _logger;

        public ExceptionMiddleware(RequestDelegate next, ILogger logger)
        {
            _next = next;
            _logger = logger;
        }

        public async Task InvokeAsync(HttpContext httpContext)
        {
            try
            {
                await _next(httpContext);
            }
            catch (HttpException ex)
            {
                _logger.LogError("{ex.StatusCode}| {ex.Message}", ex.StatusCode, ex.Message);
                await CreateExceptionAsync(httpContext, ex.StatusCode, new { error = ex.Message });
                return;
            }
            catch (ValidationException ex)
            {
                var errors = ex.Errors.Aggregate("", (x, y) => x += $"{y}\n");
                _logger.LogError(errors);
                await CreateExceptionAsync(httpContext, HttpStatusCode.BadRequest, errors);
            }
            catch (Exception ex)
            {
                _logger.LogError("{ex.Message}", ex.Message);
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
