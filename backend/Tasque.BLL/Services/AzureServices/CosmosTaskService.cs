using AutoMapper;
using Microsoft.Azure.Cosmos;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO.PartialModels;
using Tasque.Core.Common.StaticResources;

namespace Tasque.Core.BLL.Services.AzureServices
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

        public async Task<CosmosTaskModel> CreateTask(CosmosTaskModel model)
        {
            var resp = await _container.CreateItemAsync(model, new(model.Id));
            return resp.Resource;
        }

        public async Task DeleteTask(string id)
        {
            await _container.DeleteItemAsync<CosmosTaskModel>(id, new(id));
        }

        public async Task<List<CosmosTaskModel>> GetAllTasks()
        {
            var query = _container.GetItemQueryIterator<CosmosTaskModel>(new QueryDefinition(CosmosDbQueries.GetAll));
            var results = new List<CosmosTaskModel>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return results;
        }

        public async Task<CosmosTaskModel> GetTaskById(string id)
        {
            try
            {
                var response = await _container.ReadItemAsync<CosmosTaskModel>(id, new(id));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<CosmosTaskModel> UpdateTask(CosmosTaskModel model)
        {
            var resp = await _container.UpsertItemAsync(model, new(model.Id));
            return resp.Resource;
        }
    }
}
