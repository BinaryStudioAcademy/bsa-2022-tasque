using Microsoft.EntityFrameworkCore.Metadata.Internal;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.StaticResources;

namespace Tasque.Core.Common.DTO.Task.TemplateModels
{
    public class CosmosTemplateModel
    {
        [JsonProperty(PropertyName = CosmosDbKeys.IdKey)]
        public string Id { get; set; } = null!;

        [JsonProperty(PropertyName = CosmosDbKeys.TypeIdKey)]
        public int TypeId { get; set; }

        [JsonProperty(PropertyName = CosmosDbKeys.ProjectIdKey)]
        public int ProjectId { get; set; }


        [JsonProperty(PropertyName = CosmosDbKeys.CustomContextFieldsKey)]
        public string? JsonContextFields { get; set; }


        [JsonProperty(PropertyName = CosmosDbKeys.CustomDescriptionFieldsKey)]
        public string? JsonDescriptionFields { get; set; }
    }
}
