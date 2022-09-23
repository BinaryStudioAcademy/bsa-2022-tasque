using Newtonsoft.Json;
using Tasque.Core.Common.StaticResources;

namespace Tasque.Core.Common.DTO.PartialModels
{
    public class CosmosTaskModel
    {
        [JsonProperty(PropertyName = CosmosDbKeys.IdKey)]
        public string Id { get; set; } = null!;

        [JsonProperty(PropertyName = CosmosDbKeys.ProjectIdKey)]
        public string ProjectId { get; set; } = null!;

        [JsonProperty(PropertyName = CosmosDbKeys.CustomFieldsKey)]
        public List<CosmosTaskFields>? CustomFields { get; set; }
    }
}
