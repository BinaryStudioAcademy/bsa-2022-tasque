using Tasque.Core.Common.Entities;

namespace Tasque.Core.Common.DTO.PartialModels
{
    public class CustomTaskAttributes
    {
        public int TaskId { get; set; }
        public List<DateOnly>? CustomDateFields { get; set; }
        public List<TimeOnly>? CustomTimeFields { get; set; }
        public List<string>? CustomTextFields { get; set; }
        public List<string>? CustomParagraphFilds { get; set; }
        public List<string>? CustomNumberFields { get; set; }
        public List<string>? CustomLabelFields { get; set; }
        public List<string>? CustomUserFields { get; set; }
        public List<string>? CustomCheckboxFields { get; set; } // Check 
        public List<string>? CustomDropdownFields { get; set; } // if
        public List<string>? CustomDropdownDependenciesFields { get; set; } // correct
    }
}
