using AutoMapper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.DTO.Task.TemplateModels.AdditionModels;
using Tasque.Core.Common.DTO.Task.TemplateModels.CosmosModels;
using Tasque.Core.Common.DTO.Task.TemplateModels.IncomeModels;
using Tasque.Core.Common.Enums;

namespace Tasque.Core.BLL.MappingProfiles
{
    public class TaskTemplateProfile : Profile
    {
        public TaskTemplateProfile()
        {
            CreateMap<TemplateCustomField, CosmosTemplateCustomField>()
                .ForMember(ct => ct.Content, opt => opt
                    .MapFrom(
                        tt => tt.Dropdown != null ? JsonConvert.SerializeObject(tt.Dropdown) : 
                        tt.Labels != null ? JsonConvert.SerializeObject(tt.Labels) : 
                        tt.Checkbox != null? JsonConvert.SerializeObject(tt.Checkbox) : null));

            CreateMap<CosmosTemplateCustomField, TemplateCustomField>()
                .ForMember(tt => tt.Dropdown, opt => opt
                    .MapFrom(ct => ct.Type == TaskFieldType.Dropown ? JsonConvert.DeserializeObject<DropdownField>(ct.Content) : null))
                .ForMember(tt => tt.Labels, opt => opt
                    .MapFrom(ct => ct.Type == TaskFieldType.Label ? JsonConvert.DeserializeObject<List<LabelField>>(ct.Content) : null))
                .ForMember(tt => tt.Checkbox, opt => opt
                    .MapFrom(ct => ct.Type == TaskFieldType.CheckBox ? JsonConvert.DeserializeObject<CheckboxField>(ct.Content) : null));

            CreateMap<TaskTemplate, CosmosTemplateModel>()
                .ForMember(ct => ct.Content, opt => opt.Ignore());

            CreateMap<CosmosTemplateModel, TaskTemplate>()
                .ForMember(tt => tt.CustomFields, opt => opt.Ignore());
        }
    }
}
