using Microsoft.AspNetCore.Mvc;
using Microsoft.Azure.Cosmos;
using Microsoft.OpenApi.Models;
using SendGrid.Extensions.DependencyInjection;
using System.Reflection;
using System.Text.Json.Serialization;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.BLL.MappingProfiles;
using Tasque.Core.BLL.Options;
using Tasque.Core.BLL.Services;
using Tasque.Core.BLL.Services.Email;
using Tasque.Core.Common.Entities;
using Tasque.Core.Identity;
using Tasque.Core.Identity.Services;

namespace Tasque.Core.WebAPI.AppConfigurationExtension
{
    public static class AppConfigurationExtension
    {

        public static void ConfigureMapper(this IServiceCollection services)
        {
            services.AddAutoMapper(cfg =>
            {
                cfg.AddProfile<BoardProfiles>();
                cfg.AddProfile<OrganizationProfile>();
                cfg.AddProfile<TaskProfile>();
                cfg.ConfigureIdentityMapping();
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

        public static void ConfigureS3Services(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<AmazonS3Options>(configuration.GetSection(nameof(AmazonS3Options)));

            var amazonS3Options = new AmazonS3Options();
            configuration.GetSection("AmazonS3Options").Bind(amazonS3Options);

            services.AddSingleton(amazonS3Options);
        }

        public static void RegisterServices(IServiceCollection services, IConfiguration configuration)
        {

            services.ConfigureMapper();
            services.ConfigureValidator();
            services.ConfigureEmailServices(configuration);
            services.AddSwagger();            
            services.ConfigureS3Services(configuration);
            services.AddMvc();
          
            services
                .ConfigureAzureCosmosDb(configuration);
          
            var jsonOptions = new JsonOptions();

            services.AddControllers().AddJsonOptions(options =>
            options.JsonSerializerOptions.UnknownTypeHandling = JsonUnknownTypeHandling.JsonElement);

            services.AddCors();

            services
                .AddScoped<AuthService>()
                .AddScoped<ConfirmationTokenService>()
                .AddScoped<PasswordResetService>()
                .AddScoped<ProjectService>()
                .AddScoped<IEmailService, SendGridService>()
                .AddScoped<OrganizationService>()
                .AddScoped<UserService>()
                .AddScoped<FileUploadService>()
                .AddScoped<SprintService>()
                .AddScoped<TaskPriorityService>()
                .AddScoped<TaskStateService>()
                .AddScoped<TaskTypeService>()
                .AddScoped<ITaskService, TaskService>()
                .AddScoped<BoardService>();

            services.RegisterIdentity(configuration);
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

        public static IServiceCollection ConfigureAzureCosmosDb(this IServiceCollection services, IConfiguration configuration)
        {
            var cosmosOptions = new CosmosDbOptions();
            configuration.GetSection(nameof(CosmosDbOptions)).Bind(cosmosOptions);

            var client = new CosmosClient(cosmosOptions.Account, cosmosOptions.Key);
            var cosmosService = new CosmosTaskService(client, cosmosOptions.DatabaseName, cosmosOptions.ContainerName);

            services.AddSingleton<ICosmosTaskService>(cosmosService);
            return services;
        }
    }
}
