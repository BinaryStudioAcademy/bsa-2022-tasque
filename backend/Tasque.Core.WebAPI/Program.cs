global using AutoMapper;
global using FluentValidation;
using Tasque.Core.DAL;
using Tasque.Core.WebAPI.AppConfigurationExtension;
using Tasque.Core.WebAPI.Middlewares;
using Microsoft.EntityFrameworkCore;
using NLog.Extensions.Logging;
using Tasque.Messaging;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Logging.AddNLog();

// Add services to the container.

AppConfigurationExtension.RegisterServices(builder.Services, builder.Configuration);
builder.Services.RegisterEventBus(builder.Configuration);
builder.Services.AddSignalR();

builder.Services.AddDbContext<DataContext>(
    o => o.UseNpgsql(builder.Configuration["ConnectionStrings:TasqueDb"], 
        b => b.MigrationsAssembly(typeof(DataContext).Assembly.FullName))
        .EnableDetailedErrors());

builder.WebHost.UseUrls("http://*:5000");

var app = builder.Build();

// Apply pending migrations
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<DataContext>();
    if (db.Database.GetPendingMigrations().Any())
    {
        db.Database.Migrate();
    }
}

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>(app.Logger);

app.UseCors(builder =>
    builder
        .AllowAnyHeader()
        .AllowAnyOrigin()
        .AllowAnyMethod());

app.UseSwagger(action =>
{
    action.RouteTemplate = "api/swagger/{documentName}/swagger.json";
});
app.UseSwaggerUI(action => 
{
    action.SwaggerEndpoint("v1/swagger.json", "Tasque API");
    action.RoutePrefix = "api/swagger";
});

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseMiddleware<GetUserIdMiddleware>();
app.UseMigrationsEndPoint();

app.UseEndpoints(cfg =>
{
    cfg.MapControllers();
});

app.Run();
