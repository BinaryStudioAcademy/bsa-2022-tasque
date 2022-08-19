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

        public async Task<CustomAwsTaskAttributesWithKeys> CreateTask(CustomAwsTaskAttributesWithKeys model)
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

        public async Task<List<CustomAwsTaskAttributesWithKeys>> GetAllTasks()
        {
            var scanResponse = await _dbClient.ScanAsync(new(AwsTaskKeys.TableName));

            if (scanResponse != null && scanResponse.Items != null)
                return ConvertScanResponseToAwsAttributes(scanResponse);
            return new();
        }

        public async Task<CustomAwsTaskAttributesWithKeys> GetTaskById(int taskId, int projectId)
        {
            var response = await _dbClient.ScanAsync(new(AwsTaskKeys.TableName));
            if (response != null && response.Items != null)
                return ConvertScanResponseToAwsAttributes(response)
                    .FirstOrDefault(t => t.Id == taskId && t.ProjectId == projectId) ?? new();
            return new();
        }

        public async Task<CustomAwsTaskAttributesWithKeys> UpdateTask(CustomAwsTaskAttributesWithKeys model)
        {
            await _db.SaveAsync(model);
            return model;
        }

        private List<CustomAwsTaskAttributesWithKeys> ConvertScanResponseToAwsAttributes(ScanResponse scanResponse)
        {
            var taskList = new List<CustomAwsTaskAttributesWithKeys>();

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
                    {
                        ca.Add(key, MapValues(attribute?.M));
                    }
                }

                taskList.Add(JsonConvert.DeserializeObject<CustomAwsTaskAttributesWithKeys>(
                  JsonConvert.SerializeObject(ca)));
            }
            return taskList;
        }

        private Dictionary<string, object> MapValues(Dictionary<string, AttributeValue> item)
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
                {
                    ca.Add(key, MapValues(attribute?.M));
                }
            }

            return ca;
        }
    }
}
