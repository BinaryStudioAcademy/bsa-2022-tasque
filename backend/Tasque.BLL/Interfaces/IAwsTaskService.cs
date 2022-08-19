using Tasque.Core.Common.DTO;
using Tasque.Core.Common.DTO.PartialModels;

namespace Tasque.Core.BLL.Interfaces
{
    public interface IAwsTaskService
    {
        Task<List<CustomAwsTaskAttributes>> GetAllTasks();

        Task<List<CustomAwsTaskAttributes>> GetAllProjectTasks(int projectId);

        Task<CustomAwsTaskAttributes> GetTaskById(int taskId, int projectId);

        Task<CustomAwsTaskAttributes> CreateTask(CustomAwsTaskAttributes model);

        Task<CustomAwsTaskAttributes> UpdateTask(CustomAwsTaskAttributes model);

        Task DeleteTask(int taskId, int projectId); 
    }
}
