using AutoMapper;
using Microsoft.Azure.Cosmos;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO.PartialModels;
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
            string containerName, 
            IMapper mapper)
        {
            _container = dbClient.GetContainer(databaseName, containerName);
            _mapper = mapper;
        }

        public async Task DeleteTemplate(string id)
        {
            await _container.DeleteItemAsync<CosmosTemplateModel>(id, new(id));
        }

        public async Task<List<TaskTemplate>> GetAllProjectTemplates(int projectId)
        {
            var query = _container.GetItemQueryIterator<CosmosTemplateModel>(new QueryDefinition(
                CosmosDbQueries.GetAllTasks + $" WHERE c.{CosmosDbKeys.ProjectIdKey} = {projectId}"));

            var results = new List<CosmosTemplateModel>();
            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return _mapper.Map<List<TaskTemplate>>(results);
        }

        public async Task<TaskTemplate> GetTemplateById(string id)
        {
            try
            {
                var response = await _container.ReadItemAsync<CosmosTemplateModel>(id, new(id));
                return _mapper.Map<TaskTemplate>(response.Resource);
            }
            catch (CosmosException ex) when (ex.StatusCode == System.Net.HttpStatusCode.NotFound)
            {
                return null;
            }
        }

        public async Task<TaskTemplate> UpdateTemplate(TaskTemplate model)
        {
            var cosmosModel = _mapper.Map<CosmosTemplateModel>(model);
            cosmosModel.Content = _mapper.Map<List<CosmosTemplateCustomField>>(model.CustomFields);

            try
            {
                return MapCosmosModelToTemplate(
                    await _container.UpsertItemAsync(cosmosModel, new(model.Id)));
            }
            catch
            {
                return MapCosmosModelToTemplate(
                    await _container.CreateItemAsync(cosmosModel, new(model.Id)));
            }
        }

        private TaskTemplate MapCosmosModelToTemplate(ItemResponse<CosmosTemplateModel> response)
        {

            var template = _mapper.Map<TaskTemplate>(response.Resource);
            template.CustomFields = _mapper.Map<List<TemplateCustomField>>(response.Resource.Content);

            return template;
        }
    }
}
