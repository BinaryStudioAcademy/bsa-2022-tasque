using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.DTO.PartialModels;

namespace Tasque.Core.BLL.Interfaces
{
    public interface ICosmosTaskService
    {
        Task<CosmosTaskModel> GetTaskById(string id);

        Task<CosmosTaskModel> CreateTask(CosmosTaskModel model);

        Task<List<CosmosTaskModel>> GetAllTasks();

        Task<CosmosTaskModel> UpdateTask(CosmosTaskModel model);

        Task DeleteTask(string id);
    }
}
