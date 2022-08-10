using FluentValidation;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Reflection;
using System.Text;
using Tasque.Core.BLL.JWT;
using Tasque.Core.BLL.MappingProfiles;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.WebAPI.AppConfigurationExtension
{
    public static class AppConfigurationExtension
    {
        public static void ConfigureJwt(this IServiceCollection services, IConfiguration configuration)
        {
            var secretKey = configuration["JWTIssuerOptions:Key"];
            var signingKey = new SymmetricSecurityKey(Encoding.ASCII.GetBytes(secretKey));

            var jwtOptions = configuration.GetSection("JwtIssuerOptions");

            services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
                .AddJwtBearer(options =>
                {
                    options.TokenValidationParameters = new TokenValidationParameters()
                    {
                        ValidateIssuer = true,
                        ValidIssuer = jwtOptions["Issuer"],

                        ValidateAudience = true,
                        ValidAudience = jwtOptions["Audience"],

                        ValidateIssuerSigningKey = true,
                        ValidateLifetime = true,
                        IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOptions["Key"]))
                    };

                    options.Events = new JwtBearerEvents
                    {
                        OnAuthenticationFailed = context =>
                        {
                            if (context.Exception.GetType() == typeof(SecurityTokenExpiredException))
                                context.Response.Headers.Add("Token-expired", "true");

                            return System.Threading.Tasks.Task.CompletedTask;
                        }
                    };
                });
        }

        public static void ConfigureMapper(this IServiceCollection services)
        {
            services.AddAutoMapper(cfg =>
            {
                cfg.AddProfile<UserProfile>();
            },
            Assembly.GetExecutingAssembly());
        } 

        public static void ConfigureValidator(this IServiceCollection services)
        {
            services.AddValidatorsFromAssemblyContaining<UserValidator>();
        }

        public static void RegisterServices(IServiceCollection services, IConfiguration configuration)
        {
            var jwtIssuerOptions = new JwtIssuerOptions();
            configuration.GetSection("JwtIssuerOptions").Bind(jwtIssuerOptions);

            services.AddSingleton(jwtIssuerOptions);
            services.ConfigureJwt(configuration);
            services.AddScoped<JwtFactory>();
            services.AddMvc();
            services.AddControllers();

            services.AddScoped<AuthService>();
        }
    }
}
