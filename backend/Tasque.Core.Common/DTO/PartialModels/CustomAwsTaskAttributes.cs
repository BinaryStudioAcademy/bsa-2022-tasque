using Amazon.DynamoDBv2.DataModel;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.StaticResources;

namespace Tasque.Core.Common.DTO.PartialModels
{
    [DynamoDBTable(AwsTaskKeys.TableName)]
    public class CustomTaskAttributes
    {
        [DynamoDBHashKey(AwsTaskKeys.Id)]
        public int Id { get; set; }

        [DynamoDBRangeKey(AwsTaskKeys.ProjectId)]
        public int ProjectId { get; set; }

        [DynamoDBProperty(AwsTaskKeys.DateFields)]
        public List<DateOnly>? CustomDateFields { get; set; }

        [DynamoDBProperty(AwsTaskKeys.TimeFields)]
        public List<TimeOnly>? CustomTimeFields { get; set; }

        [DynamoDBProperty(AwsTaskKeys.TextFields)]
        public List<string>? CustomTextFields { get; set; }

        [DynamoDBProperty(AwsTaskKeys.ParagraphFields)]
        public List<string>? CustomParagraphFilds { get; set; }

        [DynamoDBProperty(AwsTaskKeys.NumberFields)]
        public List<string>? CustomNumberFields { get; set; }

        [DynamoDBProperty(AwsTaskKeys.LabelFields)]
        public List<string>? CustomLabelFields { get; set; }

        [DynamoDBProperty(AwsTaskKeys.UserFields)]
        public List<string>? CustomUserFields { get; set; }

        [DynamoDBProperty(AwsTaskKeys.CheckboxFields)]
        public List<string>? CustomCheckboxFields { get; set; } // Check 

        [DynamoDBProperty(AwsTaskKeys.DropdownFields)]
        public List<string>? CustomDropdownFields { get; set; } // if

        [DynamoDBProperty(AwsTaskKeys.DropdownDependenciesFields)]
        public List<string>? CustomDropdownDependenciesFields { get; set; } // correct
    }
}
