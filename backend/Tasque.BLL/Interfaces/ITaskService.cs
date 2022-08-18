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
        public Task<List<TaskDto>> GetAllTasks();

        public Task<List<TaskDto>> GetAllProjectTask(int projectId);

        public Task<TaskDto> GetTasksById(int id);

        public Task<TaskDto> CreateTask(CreateTask model);

        public Task<TaskDto> UpdateTask(UpdateTask task);

        public Task DeleteTask(int id);
    }
}
