﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.DTO.User;

namespace Tasque.Core.Common.DTO.PartialModels
{
    public class TaskCustomFields
    {
        public List<DateTime>? CustomDateFields { get; set; }
        public List<string>? CustomTextFields { get; set; }
        public List<string>? CustomParagraphFilds { get; set; }
        public List<int>? CustomNumberFields { get; set; }
        public List<string>? CustomLabelFields { get; set; }
        public List<UserDto>? CustomUserFields { get; set; }
        public List<string>? CustomCheckboxFields { get; set; }
        public List<string>? CustomDropdownFields { get; set; }
        public List<string>? CustomDropdownDependenciesFields { get; set; }
    }
}