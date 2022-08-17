using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using Tasque.Core.BLL.Exeptions;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.DTO.PartialModels;
using Tasque.Core.Common.StaticResources;

namespace Tasque.Core.BLL.Services.AWS
{
    public class AwsTaskService : IAwsTaskService
    {
        private readonly IAmazonDynamoDB _dbClient;
        private readonly IDynamoDBContext _db;

        public AwsTaskService(AmazonDynamoDBClient dynamoDb, IDynamoDBContext db)
        {
            _dbClient = dynamoDb;
            _db = db;
        }

        public async Task<CustomAwsTaskAttributes> CreateTask(CreateTask model)
        {
            throw new NotImplementedException();
        }

        public async Task DeleteTask(int taskId)
        {
            throw new NotImplementedException();
        }

        public async Task<List<CustomAwsTaskAttributes>> GetAllTasks(List<TaskDto> tasks)
        {
            var scanResponse = await _dbClient.ScanAsync(new ScanRequest(
                AwsTaskKeys.TableName));

            var customFields = new List<CustomAwsTaskAttributes>();

            //tasks.ForEach(t => customFields.Add(await _db.<CustomAwsTaskAttributes>(t.Id.ToString())));

            var taskList = new List<CustomAwsTaskAttributes>();

            if (scanResponse != null && scanResponse.Items != null)
            {
                foreach (var item in scanResponse.Items)
                {
                    item.TryGetValue(AwsTaskKeys.Id, out var id);
                    item.TryGetValue(AwsTaskKeys.ProjectId, out var projectId);
                    item.TryGetValue(AwsTaskKeys.DateFields, out var customDates);
                    item.TryGetValue(AwsTaskKeys.TimeFields, out var customTime);
                    item.TryGetValue(AwsTaskKeys.TextFields, out var customText);
                    item.TryGetValue(AwsTaskKeys.ParagraphFields, out var customParagraph);
                    item.TryGetValue(AwsTaskKeys.NumberFields, out var customNumber);
                    item.TryGetValue(AwsTaskKeys.LabelFields, out var customLabel);
                    item.TryGetValue(AwsTaskKeys.UserFields, out var customUser);
                    item.TryGetValue(AwsTaskKeys.CheckboxFields, out var customCheckbox);
                    item.TryGetValue(AwsTaskKeys.DropdownFields, out var customDropdown);
                    item.TryGetValue(AwsTaskKeys.DropdownDependenciesFields, out var customDropownDependencies);

                    List<DateOnly> dateOnlies = new();
                    customDates?.SS?.ForEach(s => dateOnlies.Add(DateOnly.Parse(s)));

                    List<TimeOnly> timeOnlies = new();
                    customTime?.SS?.ForEach(s => timeOnlies.Add(TimeOnly.Parse(s)));

                    taskList.Add(new()
                    {
                        Id = TryParseValue(id?.N),
                        ProjectId = TryParseValue(projectId?.N),
                        CustomDateFields = dateOnlies,
                        CustomTimeFields = timeOnlies,
                        CustomTextFields = customText?.SS,
                        CustomParagraphFilds = customParagraph?.SS,
                        CustomNumberFields = customNumber?.NS,
             
                        CustomLabelFields = customLabel?.NS,
                        CustomUserFields = customUser?.NS,
                        CustomCheckboxFields = customCheckbox?.SS,
                        CustomDropdownFields = customDropdown?.SS,
                        CustomDropdownDependenciesFields = customDropownDependencies?.SS,
                    });
                }
            }

            return taskList;
        }

        public async Task<CustomAwsTaskAttributes> GetTaskById(int taskId, int projectId)
        {
            return await _db.LoadAsync<CustomAwsTaskAttributes>(taskId.ToString(), projectId.ToString());
        }

        public async Task<CustomAwsTaskAttributes> UpdateTask(UpdateTask task)
        {
            throw new NotImplementedException();
        }

        public Task<List<CustomAwsTaskAttributes>> GetAllProjectTasks(int projectId)
        {
            throw new NotImplementedException();
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
