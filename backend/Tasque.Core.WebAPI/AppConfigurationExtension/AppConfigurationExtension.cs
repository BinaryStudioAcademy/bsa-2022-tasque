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
using Tasque.Core.BLL.Services.AzureServices;
using Tasque.Core.BLL.Services.Email;
using Tasque.Core.Common.Entities;
using Tasque.Core.Identity;
using Tasque.Core.Identity.MappingProfiles;
using Tasque.Core.Identity.Services;

namespace Tasque.Core.WebAPI.AppConfigurationExtension
{
    public static class AppConfigurationExtension
    {

        public static IServiceCollection ConfigureMapper(this IServiceCollection services)
        {
            services.AddAutoMapper(typeof(UserProfiles).Assembly, typeof(UserMappingProfile).Assembly);
            return services;
        }

        public static IServiceCollection ConfigureValidator(this IServiceCollection services)
        {
            services.AddValidatorsFromAssemblyContaining<UserValidator>();
            return services;
        }

        public static IServiceCollection ConfigureEmailServices(this IServiceCollection services, IConfiguration configuration)
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

            return services;
        }

        public static IServiceCollection ConfigureS3Services(this IServiceCollection services, IConfiguration configuration)
        {
            services.Configure<AmazonS3Options>(configuration.GetSection(nameof(AmazonS3Options)));

            var amazonS3Options = new AmazonS3Options();
            configuration.GetSection("AmazonS3Options").Bind(amazonS3Options);

            services.AddSingleton(amazonS3Options);
            return services;
        }

        public static void RegisterServices(IServiceCollection services, IConfiguration configuration)
        {

            services
                .ConfigureMapper()
                .ConfigureValidator()
                .ConfigureEmailServices(configuration)
                .AddSwagger()          
                .ConfigureS3Services(configuration)
                .ConfigureAzureCosmosDb(configuration)
                .AddMvc();

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
                .AddScoped<BoardService>()
                .AddScoped<BacklogService>()
                .RegisterIdentity(configuration);
        }

        public static IServiceCollection AddSwagger(this IServiceCollection services)
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

            return services;
        }

        public static IServiceCollection ConfigureAzureCosmosDb(this IServiceCollection services, IConfiguration configuration)
        {
            var cosmosOptions = new CosmosDbOptions();
            configuration.GetSection(nameof(CosmosDbOptions)).Bind(cosmosOptions);

            var mapper = new MapperConfiguration(cfg =>
            {
                cfg.AddProfile<TaskTemplateProfile>();
                cfg.AddProfile<TaskProfile>();
            }).CreateMapper();

            var client = new CosmosClient(cosmosOptions.Account, cosmosOptions.Key);
            var cosmosTaskService = new CosmosTaskService(client, cosmosOptions.DatabaseName, cosmosOptions.TaskContainerDev);
            var cosmosTemplateService = new CosmosTemplateService(client, cosmosOptions.DatabaseName, cosmosOptions.TemplateContainerDev, mapper);

            services
                .AddSingleton<ICosmosTaskService>(cosmosTaskService)
                .AddSingleton<ICosmosTemplateService>(cosmosTemplateService);

            return services;
        }
    }
}
