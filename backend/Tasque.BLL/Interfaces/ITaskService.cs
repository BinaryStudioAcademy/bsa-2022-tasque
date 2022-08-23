﻿using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.DTO.PartialModels;

namespace Tasque.Core.BLL.Interfaces
{
    public interface ITaskService
    {
        Task<TaskDto> CreateTask(CreateTaskModel model);

        Task<List<TaskDto>> GetAllTasks();

        Task<TaskDto> GetTaskById(int id);

        Task<TaskDto> UpdateTask(UpdateTaskModel model);

        Task DeleteTask(int id);
    }
}
