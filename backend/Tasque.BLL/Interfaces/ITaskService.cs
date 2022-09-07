using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.DTO.PartialModels;
using Tasque.Core.Common.DTO.Task;

namespace Tasque.Core.BLL.Interfaces
{
    public interface ITaskService
    {
        Task<TaskDto> CreateTask(TaskDto model);

        Task<List<TaskDto>> GetAllTasks();

        Task<TaskDto> GetTaskById(int id);

        Task<TaskDto> UpdateTask(TaskDto model);

        Task DeleteTask(int id);
    }
}
