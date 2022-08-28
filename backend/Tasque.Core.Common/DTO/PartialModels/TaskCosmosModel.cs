using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.StaticResources;

namespace Tasque.Core.Common.DTO.PartialModels
{
    public class TaskCosmosModel
    {
        [JsonProperty(PropertyName = CosmosDbKeys.IdKey)]
        public string Id { get; set; } = null!;

        [JsonProperty(PropertyName = CosmosDbKeys.CustomFieldsKey)]
        public List<CosmosTaskFields>? CustomFields { get; set; }
    }
}
