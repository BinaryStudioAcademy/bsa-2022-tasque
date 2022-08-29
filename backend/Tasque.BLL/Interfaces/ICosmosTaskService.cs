using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.DTO.PartialModels.TaskEntity;

namespace Tasque.Core.BLL.Interfaces
{
    public interface ICosmosTaskService
    {
        Task<TaskCosmosModel> GetTaskById(string id);

        Task<TaskCosmosModel> CreateTask(TaskCosmosModel model);

        Task<List<TaskCosmosModel>> GetAllTasks();

        Task<TaskCosmosModel> UpdateTask(TaskCosmosModel model);

        Task DeleteTask(string id);
    }
}
