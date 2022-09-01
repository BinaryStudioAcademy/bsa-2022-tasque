﻿using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.StaticResources;

namespace Tasque.Core.Common.DTO.Task.TemplateModels
{
    public class TaskTemplate
    {
        [JsonProperty(PropertyName = CosmosDbKeys.IdKey)]
        public int Id { get; set; }

        [JsonProperty(PropertyName = CosmosDbKeys.TypeIdKey)]
        public int TypeId { get; set; }

        [JsonProperty(PropertyName = CosmosDbKeys.ProjectIdKey)]
        public int ProjectId { get; set; }

        [JsonProperty(PropertyName = CosmosDbKeys.CustomContextFieldsKey)]
        public List<TaskCustomField>? CustomContextFields { get; set; }

        [JsonProperty(PropertyName = CosmosDbKeys.CustomDescriptionFieldsKey)]
        public List<TaskCustomField>? CustomDescriptionFields { get; set; }
    }
}