using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Amazon.S3;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.DTO.PartialModels;
using Tasque.Core.Common.StaticResources;

namespace Tasque.Core.BLL.Services.AWS
{
    public class AwsTaskService : IAwsTaskService
    {
        private readonly AmazonDynamoDBClient _dbClient;

        public AwsTaskService(AmazonDynamoDBClient dynamoDb)
        {
            _dbClient = dynamoDb;
        }

        public async Task<CustomTaskAttributes> CreateTask(CreateTask model)
        {
            throw new NotImplementedException();
        }

        public Task DeleteTask(int taskId)
        {
            throw new NotImplementedException();
        }

        public async Task<List<CustomTaskAttributes>> GetAllTasks()
        {
            var scanResponse = await _dbClient.ScanAsync(new ScanRequest(
                AwsTaskKeys.TableName));

            var taskList = new List<CustomTaskAttributes>();

            if (scanResponse != null && scanResponse.Items != null)
            {
                foreach (var item in scanResponse.Items)
                {
                    item.TryGetValue(AwsTaskKeys.Id, out var id);
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

        public async Task<CustomTaskAttributes> GetTaskById(int taskId)
        {
            throw new NotImplementedException();
        }

        public async Task<CustomTaskAttributes> UpdateTask(UpdateTask task)
        {
            throw new NotImplementedException();
        }
    }
}
