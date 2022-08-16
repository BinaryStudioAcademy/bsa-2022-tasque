using Tasque.Core.Common.DTO;
using Tasque.Core.Common.DTO.PartialModels;

namespace Tasque.Core.BLL.Interfaces
{
    public interface IAwsTaskService
    {
        public Task<List<CustomTaskAttributes>> GetAllTasks();

        public Task<CustomTaskAttributes> GetTaskById(int taskId);

        public Task<CustomTaskAttributes> CreateTask(CreateTask model);

        public Task<CustomTaskAttributes> UpdateTask(UpdateTask task);

        public Task DeleteTask(int taskId); 
    }
}
