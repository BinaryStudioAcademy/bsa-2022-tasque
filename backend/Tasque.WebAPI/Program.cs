//<<<<<<< HEAD
using Tasque.Core.DAL;
using Tasque.Core.WebAPI.AppConfigurationExtension;
using Tasque.Core.WebAPI.Middlewares;
//=======
using Tasque.Core.WebAPI.Middlewares;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.DAL;
using NLog.Extensions.Logging;
//>>>>>>> 2913fbabe3af70c09b3adb501f60c33335cfaa0b
var builder = WebApplication.CreateBuilder(args);

builder.Logging.ClearProviders();
builder.Logging.AddNLog();

// Add services to the container.

AppConfigurationExtension.RegisterServices(builder.Services, builder.Configuration);

builder.Services.AddDbContext<DataContext>(
    o => o.UseNpgsql(builder.Configuration.GetConnectionString("TasqueDb"), 
        b => b.MigrationsAssembly(typeof(DataContext).Assembly.FullName))
        .EnableDetailedErrors());
var app = builder.Build();


// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseDeveloperExceptionPage();
}
if (!app.Environment.IsDevelopment())
{
    app.UseExceptionHandler("/Error");
    // The default HSTS value is 30 days. You may want to change this for production scenarios, see https://aka.ms/aspnetcore-hsts.
    app.UseHsts();
}


app.UseMigrationsEndPoint();


app.UseHttpsRedirection();
app.UseMiddleware<ExceptionMiddleware>();
app.UseStaticFiles();

app.UseRouting();

app.UseAuthentication();
app.UseAuthorization();

app.UseEndpoints(endpoints =>
{
    endpoints.MapControllers();
});

app.MapRazorPages();

app.Run();
