using AutoMapper;
using Microsoft.Azure.Cosmos;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO.Task.TemplateModels;
using Tasque.Core.Common.StaticResources;

namespace Tasque.Core.BLL.Services
{
    public class CosmosTemplateService : ICosmosTemplateService
    {
        private readonly Container _container;
        private readonly IMapper _mapper;
        public CosmosTemplateService(
            CosmosClient dbClient,
            string databaseName,
            string containerName, IMapper mapper)
        {
            _container = dbClient.GetContainer(databaseName, containerName);
            _mapper = mapper;
        }

        public async Task<TaskTemplate> CreateTemplate(TaskTemplate model)
        {

            var resp = await _container.CreateItemAsync(_mapper.Map<CosmosTemplateModel>(model), new(model.Id));
            return _mapper.Map<TaskTemplate>(resp.Resource);
        }

        public async Task DeleteTemplate(string id)
        {
            await _container.DeleteItemAsync<TaskTemplate>(id, new(id));
        }

        public async Task<List<TaskTemplate>> GetAllProjectTemplates(int projectId)
        {
            var query = _container.GetItemQueryIterator<TaskTemplate>(new QueryDefinition(
                CosmosDbQueries.GetAllTasks + $" WHERE c.{CosmosDbKeys.ProjectIdKey} = {projectId}"));

            var results = new List<TaskTemplate>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return results;
        }

        public async Task<TaskTemplate> GetTemplateById(string id)
        {
            try
            {
                var response = await _container.ReadItemAsync<TaskTemplate>(id, new(id));
                return response.Resource;
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<TaskTemplate> UpdateTemplate(TaskTemplate model)
        {
            try
            {
                var resp = await _container.UpsertItemAsync(_mapper.Map<CosmosTemplateModel>(model), new(model.Id));
                return _mapper.Map<TaskTemplate>(resp.Resource);
            }
            catch
            {
                var resp = await _container.CreateItemAsync(_mapper.Map<CosmosTemplateModel>(model), new(model.Id));
                return _mapper.Map<TaskTemplate>(resp.Resource);
            }
        }
    }
}
