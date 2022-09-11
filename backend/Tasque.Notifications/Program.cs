using Microsoft.EntityFrameworkCore;
using NLog.Extensions.Logging;
using Tasque.Core.Common.Models.Events;
using Tasque.Messaging;
using Tasque.Messaging.Abstractions;
using Tasque.Notifications.Data;
using Tasque.Notifications.Handlers;
using Tasque.Notifications.Hubs;
using AutoMapper;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Logging.AddNLog();

builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();

RegisterHandlers(builder.Services);
builder.Services.RegisterEventBus(builder.Configuration);

builder.Services.AddDbContext<NotificationsContext>(
    o => o.UseNpgsql(builder.Configuration["ConnectionStrings:NotificationsDb"],
        b => b.MigrationsAssembly(typeof(NotificationsContext).Assembly.FullName))
        .EnableDetailedErrors());

builder.Services.AddSignalR();

builder.Services.AddSingleton<NotificationsHub>();

var app = builder.Build();

// Apply pending migrations
using (var scope = app.Services.CreateScope())
{
    var db = scope.ServiceProvider.GetRequiredService<NotificationsContext>();
    if (db.Database.GetPendingMigrations().Any())
    {
        db.Database.Migrate();
    }
}

using (var scope = app.Services.CreateScope())
{
    AddSubscriptions(scope.ServiceProvider);
}

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapHub<NotificationsHub>("/notifications");

app.MapControllers();

app.Run();

static void RegisterHandlers(IServiceCollection services)
{
    services.AddSingleton<UserInvitedEventHandler>();
}

static void AddSubscriptions(IServiceProvider services)
{
    var bus = services.GetRequiredService<IEventBus>();

    bus.Subscribe<UserInvitedEvent, UserInvitedEventHandler>();
}
