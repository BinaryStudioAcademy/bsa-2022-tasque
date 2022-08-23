using Microsoft.Azure.Cosmos;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO.PartialModels;
using Tasque.Core.Common.StaticResources;

namespace Tasque.Core.BLL.Services
{
    public class CosmosTaskService : ICosmosTaskService
    {
        private readonly Container _container;
        public CosmosTaskService(
            CosmosClient dbClient,
            string databaseName,
            string containerName)
        {
            _container = dbClient.GetContainer(databaseName, containerName);
        }

        public async Task<TaskCosmosModel> CreateTask(TaskCosmosModel model)
        {
            var resp = await _container.CreateItemAsync(model, new(model.Id));
            return resp.Resource;
        }

        public async Task DeleteTask(string id)
        {
            await _container.DeleteItemAsync<TaskCosmosModel>(id, new(id));
        }

        public async Task<List<TaskCosmosModel>> GetAllTasks()
        {
            var query = _container.GetItemQueryIterator<TaskCosmosModel>(new QueryDefinition(CosmosDbQueries.GetAllTasks));
            var results = new List<TaskCosmosModel>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return results;
        }

        public async Task<TaskCosmosModel> GetTaskById(string id)
        {
            try
            {
                var response = await _container.ReadItemAsync<TaskCosmosModel>(id, new(id));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<TaskCosmosModel> UpdateTask(TaskCosmosModel model)
        {
            var resp = await _container.UpsertItemAsync(model, new(model.Id));
            return resp.Resource;
        }
    }
}
