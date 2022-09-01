using Microsoft.Azure.Cosmos;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.BLL.Interfaces;

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
    }
}
