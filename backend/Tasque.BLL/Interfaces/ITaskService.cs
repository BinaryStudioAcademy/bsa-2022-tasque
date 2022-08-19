using System;
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
        Task<List<TaskDto>> GetAllTasks();

        Task<List<TaskDto>> GetAllProjectTask(int projectId);

        Task<TaskDto> GetTasksById(int id);

        Task<TaskDto> CreateTask(CreateTask model);

        Task<TaskDto> UpdateTask(UpdateTask task);

        Task DeleteTask(int id);
    }
}
