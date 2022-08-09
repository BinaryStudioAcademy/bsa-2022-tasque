using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Tasque.Core.BLL.JWT;

namespace Tasque.Core.WebAPI.AppConfigurationExtension
{
    public static class AppConfigurationExtension
    {
        public static void ConfigureJwt(this IServiceCollection services, IConfiguration configuration)
        {
            var secretKey = configuration["SecretJWTKey"];
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

                            return Task.CompletedTask;
                        }
                    };
                });
        }

        public static void RegisterServices(IServiceCollection services, IConfiguration configuration)
        {
            var jwtIssuerOptions = new JwtIssuerOptions();
            configuration.GetSection("JwtIssuerOptions").Bind(jwtIssuerOptions);

            services.AddSingleton(jwtIssuerOptions);
            services.AddRazorPages();
            services.ConfigureJwt(configuration);
            services.AddScoped<JwtFactory>();
            services.AddMvc();
            services.AddControllers();
        }
    }
}
