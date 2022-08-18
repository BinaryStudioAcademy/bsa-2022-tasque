using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.Model;
using Tasque.Core.BLL.Exeptions;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO.PartialModels;
using Tasque.Core.Common.StaticResources;

namespace Tasque.Core.BLL.Services.AWS
{
    public class AwsTaskService : IAwsTaskService
    {
        private readonly IAmazonDynamoDB _dbClient;
        private readonly IDynamoDBContext _db;

        public AwsTaskService(IAmazonDynamoDB dynamoDb, IDynamoDBContext db)
        {
            _dbClient = dynamoDb;
            _db = db;
        }

        public async Task<CustomAwsTaskAttributes> CreateTask(CustomAwsTaskAttributes model)
        {
            await _db.SaveAsync(model);
            return model;
        }

        public async Task DeleteTask(int taskId, int projectId)
        {
            await _dbClient.DeleteItemAsync(AwsTaskKeys.TableName, new()
            {
                { 
                    AwsTaskKeys.Id, new() 
                    { 
                        N = taskId.ToString(),
                    } 
                },
                { 
                    AwsTaskKeys.ProjectId, new() 
                    {
                        N = projectId.ToString(),
                    } 
                }
            });
        }

        public async Task<List<CustomAwsTaskAttributes>> GetAllTasks()
        {
            var scanResponse = await _dbClient.ScanAsync(new(AwsTaskKeys.TableName));

            if (scanResponse != null && scanResponse.Items != null)
                return ConvertScanResponseToAwsAttributes(scanResponse);
            return new();
        }

        public async Task<CustomAwsTaskAttributes> GetTaskById(int taskId, int projectId)
        {
            var response = await _dbClient.ScanAsync(new(AwsTaskKeys.TableName));
            if(response != null && response.Items != null)
                return ConvertScanResponseToAwsAttributes(response)
                    .FirstOrDefault(t => t.Id == taskId && t.ProjectId == projectId)?? new();
            return new();
        }

        public async Task<CustomAwsTaskAttributes> UpdateTask(CustomAwsTaskAttributes model)
        {
            await _db.SaveAsync(model);
            return model;
        }

        public Task<List<CustomAwsTaskAttributes>> GetAllProjectTasks(int projectId)
        {
            throw new NotImplementedException();
        }

        private List<CustomAwsTaskAttributes> ConvertScanResponseToAwsAttributes(ScanResponse scanResponse)
        {
            var taskList = new List<CustomAwsTaskAttributes>();

            foreach (var item in scanResponse.Items)
            {
                item.TryGetValue(AwsTaskKeys.Id, out var id);
                item.TryGetValue(AwsTaskKeys.ProjectId, out var projectId);
                item.TryGetValue(AwsTaskKeys.DateFields, out var customDates);
                item.TryGetValue(AwsTaskKeys.TextFields, out var customText);
                item.TryGetValue(AwsTaskKeys.ParagraphFields, out var customParagraph);
                item.TryGetValue(AwsTaskKeys.NumberFields, out var customNumber);
                item.TryGetValue(AwsTaskKeys.LabelFields, out var customLabel);
                item.TryGetValue(AwsTaskKeys.UserFields, out var customUser);
                item.TryGetValue(AwsTaskKeys.CheckboxFields, out var customCheckbox);
                item.TryGetValue(AwsTaskKeys.DropdownFields, out var customDropdown);
                item.TryGetValue(AwsTaskKeys.DropdownDependenciesFields, out var customDropownDependencies);

                var data = new CustomAwsTaskAttributes()
                {
                    Id = TryParseValue(id?.N),
                    ProjectId = TryParseValue(projectId?.N),
                    CustomTextFields = customText?.SS,
                    CustomParagraphFilds = customParagraph?.SS,
                    CustomNumberFields = customNumber?.NS,

                    CustomLabelFields = customLabel?.NS,
                    CustomUserFields = customUser?.NS,
                    CustomCheckboxFields = customCheckbox?.SS,
                    CustomDropdownFields = customDropdown?.SS,
                    CustomDropdownDependenciesFields = customDropownDependencies?.SS,
                };

                if (customDates != null)
                {
                    List<DateTime> dateOnlies = new();
                    customDates?.SS?.ForEach(s => dateOnlies.Add(DateTime.Parse(s)));
                    data.CustomDateFields = dateOnlies;
                }
                taskList.Add(data);
            }
            return taskList;
        }

        private int TryParseValue(string? num)
        {
            try
            {
                return int.Parse(num?? throw new AwsException("Null"));
            }
            catch(Exception ex)
            {
                throw new AwsException(ex.Message);
            }
        }
    }
}
