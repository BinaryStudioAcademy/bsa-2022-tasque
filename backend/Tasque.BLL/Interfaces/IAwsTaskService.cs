using Tasque.Core.Common.DTO;
using Tasque.Core.Common.DTO.PartialModels;

namespace Tasque.Core.BLL.Interfaces
{
    public interface IAwsTaskService
    {
        public Task<List<CustomAwsTaskAttributes>> GetAllTasks();

        public Task<List<CustomAwsTaskAttributes>> GetAllProjectTasks(int projectId);

        public Task<CustomAwsTaskAttributes> GetTaskById(int taskId, int projectId);

        public Task<CustomAwsTaskAttributes> CreateTask(CustomAwsTaskAttributes model);

        public Task<CustomAwsTaskAttributes> UpdateTask(CustomAwsTaskAttributes model);

        public Task DeleteTask(int taskId, int projectId); 
    }
}
