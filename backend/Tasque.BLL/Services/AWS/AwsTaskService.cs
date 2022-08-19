using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.DataModel;
using Amazon.DynamoDBv2.Model;
using AutoMapper;
using Newtonsoft.Json;
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
                var ca = new Dictionary<string, object>();

                foreach (var key in item.Keys)
                {
                    item.TryGetValue(key, out var attribute);

                    if (key == AwsTaskKeys.Id || key == AwsTaskKeys.ProjectId)
                    {
                        ca.Add(key, int.Parse(attribute?.N));
                        continue;
                    }

                    if (!string.IsNullOrEmpty(attribute?.S))
                        ca.Add(key, attribute?.S);
                    else if (attribute.SS != null && attribute.SS.Count != 0)
                        ca.Add(key, attribute?.SS);
                    else if (attribute?.N != null)
                        ca.Add(key, attribute?.N);
                    else if (attribute?.NS.Count != 0)
                        ca.Add(key, attribute?.NS);
                    else if (attribute?.L.Count != 0)
                        ca.Add(key, attribute?.L);
                    else if (attribute?.M != null)
                        ca.Add(key, attribute?.M);
                }

                taskList.Add(JsonConvert.DeserializeObject<CustomAwsTaskAttributes>(
                  JsonConvert.SerializeObject(ca)));
            }
            return taskList;
        }

        private List<Dictionary<string, string>> GetAttributes(ScanResponse scanResponse)
        {
            var attributeList = new List<Dictionary<string, string>>();

            foreach (var item in scanResponse.Items)
            {
                var keyValuePair = new Dictionary<string, string>();

                foreach (var key in item.Keys)
                {
                    item.TryGetValue(key, out var attributes);
                    //if (attributes != null)
                        keyValuePair.Add(key, attributes.S);
                }

                attributeList.Add(keyValuePair);
            }

            return attributeList;
        }

        private int? TryParseValue(string? num, out bool isSucced)
        {
            try
            {
                isSucced = true;
                return int.Parse(num);
            }
            catch(Exception ex)
            {
                isSucced = false;
                return null;
            }
        }
    }
}
