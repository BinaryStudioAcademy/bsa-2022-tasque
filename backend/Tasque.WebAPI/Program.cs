global using AutoMapper;
global using FluentValidation;
using Tasque.Core.DAL;
using Tasque.Core.WebAPI.AppConfigurationExtension;
using Tasque.Core.WebAPI.Middlewares;
using Microsoft.EntityFrameworkCore;
using NLog.Extensions.Logging;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Logging.ClearProviders();
builder.Logging.AddNLog();

builder.Services.ConfigureMapper();
builder.Services.ConfigureValidator();
builder.Services.ConfigureEmailServices(builder.Configuration);
builder.Services.AddSwagger();

// Add services to the container.

AppConfigurationExtension.RegisterServices(builder.Services, builder.Configuration);

builder.Services.AddDbContext<DataContext>(
    o => o.UseNpgsql(builder.Configuration.GetConnectionString("TasqueDb"), 
        b => b.MigrationsAssembly(typeof(DataContext).Assembly.FullName))
        .EnableDetailedErrors());


var app = builder.Build();

// Configure the HTTP request pipeline.
app.UseMiddleware<ExceptionMiddleware>(app.Logger);

if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    app.UseHsts();
}

app.UseCors(builder => 
    builder
        .AllowAnyHeader()
        .AllowAnyOrigin()
        .AllowAnyMethod());
        
app.UseSwagger();
app.UseSwaggerUI();

app.UseHttpsRedirection();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseMigrationsEndPoint();

app.MapControllers();
app.Run();
