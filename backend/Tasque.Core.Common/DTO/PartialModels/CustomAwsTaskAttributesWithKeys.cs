using Amazon.DynamoDBv2.DataModel;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.StaticResources;

namespace Tasque.Core.Common.DTO.PartialModels
{
    [DynamoDBTable(AwsTaskKeys.TableName)]
    public class CustomAwsTaskAttributesWithKeys
    {
        [DynamoDBHashKey(AwsTaskKeys.Id)]
        public int Id { get; set; }

        [DynamoDBRangeKey(AwsTaskKeys.ProjectId)]
        public int ProjectId { get; set; }

        [DynamoDBProperty(AwsTaskKeys.CustomFields)]
        public CustomAwsTaskAttributes? CustomFields { get; set; }
    }
}
