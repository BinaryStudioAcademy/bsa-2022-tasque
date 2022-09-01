﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.DTO.Task.TemplateModels;

namespace Tasque.Core.BLL.Interfaces
{
    public interface ICosmosTemplateService
    {
        Task<TaskTemplate> CreateTemplate(TaskTemplate model);

        Task DeleteTemplate(string id);

        Task<List<TaskTemplate>> GetAllProjectTemplates(string projectId);

        Task<TaskTemplate> GetTemplateById(string id);

        Task<TaskTemplate> UpdateTemplate(TaskTemplate model);
    }
}