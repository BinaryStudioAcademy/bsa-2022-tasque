﻿using Microsoft.Azure.Cosmos;
using Tasque.Core.BLL.Interfaces;
using Tasque.Core.Common.DTO.Task.TemplateModels;
using Tasque.Core.Common.StaticResources;

namespace Tasque.Core.BLL.Services
{
    public class CosmosTemplateService : ICosmosTemplateService
    {
        private readonly Container _container;
        public CosmosTemplateService(
            CosmosClient dbClient,
            string databaseName,
            string containerName)
        {
            _container = dbClient.GetContainer(databaseName, containerName);
        }

        public async Task<TaskTemplate> CreateTemplate(TaskTemplate model)
        {
            var resp = await _container.CreateItemAsync(model, new(model.Id));
            return resp.Resource;
        }

        public async Task DeleteTemplate(string id)
        {
            await _container.DeleteItemAsync<TaskTemplate>(id, new(id));
        }

        public async Task<List<TaskTemplate>> GetAllProjectTemplates(string projectId)
        {
            var query = _container.GetItemQueryIterator<TaskTemplate>(new QueryDefinition(
                CosmosDbQueries.GetAllTasks + $" WHERE {CosmosDbKeys.ProjectIdKey} = {projectId}"));

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
            var resp = await _container.UpsertItemAsync(model, new(model.Id));
            return resp.Resource;
        }
    }
}
