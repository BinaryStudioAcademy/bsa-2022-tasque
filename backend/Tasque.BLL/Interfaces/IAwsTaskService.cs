using Tasque.Core.Common.DTO;
using Tasque.Core.Common.DTO.PartialModels;

namespace Tasque.Core.BLL.Interfaces
{
    public interface IAwsTaskService
    {
        public Task<List<CustomAwsTaskAttributes>> GetAllTasks(List<TaskDto> tasks);

        public Task<List<CustomAwsTaskAttributes>> GetAllProjectTasks(int projectId);

        public Task<CustomAwsTaskAttributes> GetTaskById(int taskId, int projectId);

        public Task<CustomAwsTaskAttributes> CreateTask(CreateTask model);

        public Task<CustomAwsTaskAttributes> UpdateTask(UpdateTask task);

        public Task DeleteTask(int taskId); 
    }
}
