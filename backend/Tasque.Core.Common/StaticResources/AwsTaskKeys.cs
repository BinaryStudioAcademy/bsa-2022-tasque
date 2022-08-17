using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.StaticResources
{
    public static class AwsTaskKeys
    {
        public const string TableName = "task-table";

        public const string Id = "Id";

        public const string ProjectId = "ProjectId";

        public const string DateFields = "CustomDateFields";

        public const string TimeFields = "CustomTimeFields";

        public const string TextFields = "CustomTextFields";

        public const string ParagraphFields = "CustomParagraphFields";

        public const string NumberFields = "CustomNumberFields";

        public const string UserFields = "CustomUserFields";

        public const string LabelFields = "CustomLabelFields";

        public const string CheckboxFields = "CustomCheckboxFields";

        public const string DropdownFields = "CustomDropdownFields";

        public const string DropdownDependenciesFields = "CustomDropdownDependenciesFields";
    }
}
