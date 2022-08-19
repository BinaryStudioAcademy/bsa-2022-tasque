using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using SendGrid.Extensions.DependencyInjection;
using System.Reflection;
using System.Text;
using Tasque.Core.BLL.JWT;
using Tasque.Core.BLL.MappingProfiles;
using Tasque.Core.BLL.Options;
using Tasque.Core.BLL.Services;
using Tasque.Core.BLL.Services.Auth;
using Tasque.Core.BLL.Services.Email;
using Tasque.Core.Common.Entities;
using Amazon.Extensions.NETCore.Setup;
using Amazon.Runtime;
using Amazon;
using Tasque.Core.BLL.Services.Email.MailJet;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.BLL.Services.AWS;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2;

namespace Tasque.Core.WebAPI.AppConfigurationExtension
{
    public static class AppConfigurationExtension
    {
        public static void ConfigureJwt(this IServiceCollection services, IConfiguration configuration)
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

        public static void ConfigureMapper(this IServiceCollection services)
        {
            services.AddAutoMapper(cfg =>
            {
                cfg.AddProfile<UserProfile>();
                cfg.AddProfile<OrganizationProfile>();
                cfg.AddProfile<TaskProfile>();
            },
            Assembly.GetExecutingAssembly());
        }

        public static void ConfigureValidator(this IServiceCollection services)
        {
            services.AddValidatorsFromAssemblyContaining<UserValidator>();
        }

        public static void ConfigureEmailServices(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<EmailConfirmationOptions>(configuration.GetSection(nameof(EmailConfirmationOptions)));

            #region MailJet Service

            /*
            var options = new MailJetOptions();
            var section = configuration.GetSection(nameof(MailJetOptions));
            section.Bind(options);
            services.AddHttpClient<IMailjetClient, MailjetClient>(client =>
            {
                client.SetDefaultSettings();
                client.UseBasicAuthentication(options.ApiKey, options.ApiSecret);
            });
            services.Configure<MailJetOptions>(section);
            */

            #endregion

            #region SendGrid Service

            var options = new SendGridOptions();
            configuration.GetSection(nameof(SendGridOptions)).Bind(options);
            services.AddSendGrid(opt =>
            {
                opt.ApiKey = options.ApiKey;
            });

            #endregion
        }

        public static void RegisterServices(IServiceCollection services, IConfiguration configuration)
        {
            var jwtIssuerOptions = new JwtIssuerOptions();
            configuration.GetSection(nameof(JwtIssuerOptions)).Bind(jwtIssuerOptions);

            services.AddDefaultAWSOptions(configuration.GetAWSOptions());

            var awsOpt = new AwsCustomOptions();
            configuration.GetSection(nameof(AwsCustomOptions)).Bind(awsOpt);

            var credentials = new BasicAWSCredentials(awsOpt.AccessKey, awsOpt.SecretKey);

            var awsOptions = new AWSOptions()
            {
                Region = RegionEndpoint.USEast1,
                Profile = awsOpt.AWSProfile,
                Credentials = credentials,
            };

            services.AddDefaultAWSOptions(awsOptions);

            services.AddSingleton(jwtIssuerOptions);
            services.ConfigureJwt(configuration);
            services.AddScoped<JwtFactory>();
            services.AddMvc();
            services.AddControllers();
            services.AddCors();

            services
                .AddScoped<AuthService>()
                .AddScoped<ConfirmationTokenService>()
                .AddScoped<PasswordResetService>()
                .AddScoped<ProjectService>()
                .AddScoped<IEmailService, SendGridService>()
                .AddScoped<OrganizationService>()
                .AddAWSService<IAmazonDynamoDB>()
                .AddScoped<IDynamoDBContext, DynamoDBContext>()
                .AddScoped<IAwsTaskService, AwsTaskService>()
                .AddScoped<ITaskService, TaskService>();
        }

        public static void AddSwagger(this IServiceCollection services)
        {
            services.AddSwaggerGen(c =>
            {
                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme()
                {
                    Name = "Authorization",
                    Type = SecuritySchemeType.ApiKey,
                    Scheme = "Bearer",
                    BearerFormat = "JWT",
                    In = ParameterLocation.Header,
                    Description = "JWT Authorization header using the Bearer scheme. \r\n\r\n Enter 'Bearer' [space] and then " +
                    "your token in the text input below.\r\n\r\nExample: \"Bearer 12345abcdef\"",
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                          new OpenApiSecurityScheme
                            {
                                Reference = new OpenApiReference
                                {
                                    Type = ReferenceType.SecurityScheme,
                                    Id = "Bearer"
                                }
                            },
                            new string[] {}

                    }
                });

                c.SwaggerDoc("v1", new OpenApiInfo { Title = "Tasque.Core.WebApi", Version = "v1" });
            });
        }
    }
}
