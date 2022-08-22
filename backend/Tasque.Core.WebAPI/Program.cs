global using AutoMapper;
global using FluentValidation;
using Tasque.Core.DAL;
using Tasque.Core.WebAPI.AppConfigurationExtension;
using Tasque.Core.WebAPI.Middlewares;
using Tasque.Core.Identity;
using Microsoft.EntityFrameworkCore;
using NLog.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Logging.ClearProviders();
builder.Logging.AddNLog();

builder.Services.ConfigureMapper();
builder.Services.ConfigureValidator();
builder.Services.ConfigureCurrentUserParameters();
builder.Services.ConfigureEmailServices(builder.Configuration);
builder.Services.AddSwagger();

// Add services to the container.

AppConfigurationExtension.RegisterServices(builder.Services, builder.Configuration);

builder.Services.AddCors();

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

app.UseSwagger();
app.UseSwaggerUI();

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
