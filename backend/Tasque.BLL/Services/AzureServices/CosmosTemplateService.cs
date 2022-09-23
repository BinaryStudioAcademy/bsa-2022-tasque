using AutoMapper;
using Microsoft.Azure.Cosmos;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO.PartialModels;
using Tasque.Core.Common.DTO.Task.TemplateModels.CosmosModels;
using Tasque.Core.Common.DTO.Task.TemplateModels.IncomeModels;
using Tasque.Core.Common.StaticResources;

namespace Tasque.Core.BLL.Services.AzureServices
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
                CosmosDbQueries.GetAll + $" WHERE c.{CosmosDbKeys.ProjectIdKey} = {projectId}"));

            var results = new List<CosmosTemplateModel>();

            while (query.HasMoreResults)
            {
                var response = await query.ReadNextAsync();

                results.AddRange(response.ToList());
            }

            return MapCosmosModelToTaskTemplate(results);
        }

        public async Task<TaskTemplate?> GetTemplateById(string id)
        {
            try
            {
                return MapItemResponseToTaskTemplate(
                    await _container.ReadItemAsync<CosmosTemplateModel>(id, new(id)));
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
                return MapItemResponseToTaskTemplate(
                    await _container.UpsertItemAsync(cosmosModel, new(model.Id)));
            }
            catch
            {
                return MapItemResponseToTaskTemplate(
                    await _container.CreateItemAsync(cosmosModel, new(model.Id)));
            }
        }

        private TaskTemplate MapItemResponseToTaskTemplate(ItemResponse<CosmosTemplateModel> response)
        {

            var template = _mapper.Map<TaskTemplate>(response.Resource);
            template.CustomFields = _mapper.Map<List<TemplateCustomField>>(response.Resource.Content);

            return template;
        }

        private TaskTemplate MapCosmosModelToTaskTemplate(CosmosTemplateModel model)
        {
            var template = _mapper.Map<TaskTemplate>(model);
            template.CustomFields = _mapper.Map<List<TemplateCustomField>>(model.Content);

            return template;
        }

        private List<TaskTemplate> MapCosmosModelToTaskTemplate(List<CosmosTemplateModel> models)
        {
            var templates = new List<TaskTemplate>();
            models.ForEach(ct => templates.Add(MapCosmosModelToTaskTemplate(ct)));

            return templates;
        }
    }
}
