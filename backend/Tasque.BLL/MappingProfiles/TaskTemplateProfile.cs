using AutoMapper;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.DTO.Task.TemplateModels;

namespace Tasque.Core.BLL.MappingProfiles
{
    public class TaskTemplateProfile : Profile
    {
        public TaskTemplateProfile()
        {

            CreateMap<TaskTemplate, CosmosTemplateModel>()
                .ForMember(tt => tt.JsonContextFields, opt => opt.MapFrom(tt => JsonConvert.SerializeObject(tt.CustomContextFields)))
                .ForMember(tt => tt.JsonDescriptionFields, opt => opt.MapFrom(tt => JsonConvert.SerializeObject(tt.CustomDescriptionFields)));


            CreateMap<CosmosTemplateModel, TaskTemplate>()
                .ForMember(ct => ct.CustomContextFields, opt => opt.MapFrom(ct => JsonConvert.DeserializeObject<List<TaskCustomField>>(ct.JsonContextFields)))
                .ForMember(ct => ct.CustomDescriptionFields, opt => opt.MapFrom(ct => JsonConvert.DeserializeObject<List<TaskCustomField>>(ct.JsonDescriptionFields)));

            //new MapperConfiguration(cfg =>
            //{
            //    cfg.CreateMap<TaskTemplate, CosmosTemplateModel>()
            //    .ForMember(tt => tt.JsonContextFields, opt => opt.MapFrom(tt => JsonConvert.SerializeObject(tt.CustomContextFields)))
            //    .ForMember(tt => tt.JsonDescriptionFields, opt => opt.MapFrom(tt => JsonConvert.SerializeObject(tt.CustomDescriptionFields)));
            //}).CreateMapper();

            //new MapperConfiguration(cfg =>
            //{
            //    cfg.CreateMap<CosmosTemplateModel, TaskTemplate>()
            //    .ForMember(ct => ct.CustomContextFields, opt => opt.MapFrom(ct => JsonConvert.DeserializeObject<List<TaskCustomField>>(ct.JsonContextFields)))
            //    .ForMember(ct => ct.CustomDescriptionFields, opt => opt.MapFrom(ct => JsonConvert.DeserializeObject<List<TaskCustomField>>(ct.JsonDescriptionFields)));
            //}).CreateMapper();
        }
    }
}
