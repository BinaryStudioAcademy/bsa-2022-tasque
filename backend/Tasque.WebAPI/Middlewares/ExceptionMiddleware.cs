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
            catch (Exception exception)
            {
                switch (exception)
                {
                    case HttpException ex:
                        await HandleHttpException(httpContext, ex);
                        break;
                    case ValidationException ex:
                        await HandleValidationException(httpContext, ex);
                        break;
                    case EmailNotConfirmedException ex:
                        await HandleEmailNotConfirmedException(httpContext, ex);
                        break;
                    default:
                        await HandleGenericException(httpContext, exception);
                        break;
                }
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

        private async Task HandleGenericException(HttpContext context, Exception ex)
        {
            _logger.LogError("{ex.Message}", ex.Message);
            await CreateExceptionAsync(context);
        }
        private async Task HandleHttpException(HttpContext context, HttpException ex)
        {
            _logger.LogError("{ex.StatusCode}| {ex.Message}", ex.StatusCode, ex.Message);
            await CreateExceptionAsync(context, ex.StatusCode, new { error = ex.Message });
            return;
        }
        private async Task HandleValidationException(HttpContext context, ValidationException ex)
        {
            var message = ex.Errors.Any()
                    ? ex.Errors.Aggregate("", (x, y) => x += $"{y.ErrorMessage}\n")
                    : ex.Message;
            await CreateExceptionAsync(context, HttpStatusCode.BadRequest, message);
        }
        private async Task HandleEmailNotConfirmedException(HttpContext httpContext, EmailNotConfirmedException ex)
        {
            await CreateExceptionAsync(httpContext, HttpStatusCode.Forbidden, ex.Message);
        }
    }
}
