using AutoMapper;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Tasque.Core.Identity.Helpers;
using Tasque.Core.Identity.JWT;
using Tasque.Core.Identity.MappingProfiles;
using Tasque.Core.Identity.Options;

namespace Tasque.Core.Identity
{
    public static class Registrations
    {
        public static IServiceCollection RegisterIdentity(this IServiceCollection services, IConfiguration configuration)
        {
            var jwtIssuerOptions = new JwtIssuerOptions();
            configuration.GetSection("JwtIssuerOptions").Bind(jwtIssuerOptions);

            services.AddSingleton(jwtIssuerOptions);
            services.ConfigureJwt(configuration);
            services.AddScoped<JwtFactory>();

            services.ConfigureCurrentUserParameters();

            return services;
        }

        public static void ConfigureIdentityMapping(this IMapperConfigurationExpression cfg)
        {
            cfg.AddProfile<UserMappingProfile>();
        }

        private static void ConfigureJwt(this IServiceCollection services, IConfiguration configuration)
        {
            var secretKey = configuration["JwtIssuerOptions:Key"];
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

        private static void ConfigureCurrentUserParameters(this IServiceCollection services)
        {
            services.AddScoped(typeof(CurrentUserParameters));
        }
    }
}
