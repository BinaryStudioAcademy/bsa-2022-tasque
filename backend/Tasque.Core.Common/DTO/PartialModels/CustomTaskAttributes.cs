using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.Common.DTO.PartialModels
{
    public class CustomTaskAttributes
    {
        public List<DateOnly>? CustomDateFields { get; set; }
        public List<TimeOnly>? CustomTimeFields { get; set; }
        public List<string>? CustomTextFields { get; set; }
        public List<string>? CustomParagraphFilds { get; set; }
        public List<int>? CustomNumberFields { get; set; }
        public List<Label>? CustomLabelFields { get; set; }
        public List<User>? CustomUserFields { get; set; }
        public List<string>? CustomCheckboxFields { get; set; } // Check 
        public List<string>? CustomDropdownFields { get; set; } // if
        public List<string>? CustomDropdownDependenciesFields { get; set; } // correct
    }
}
