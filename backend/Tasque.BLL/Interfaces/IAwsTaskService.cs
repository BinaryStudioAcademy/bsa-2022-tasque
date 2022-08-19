using Tasque.Core.Common.DTO;
using Tasque.Core.Common.DTO.PartialModels;

namespace Tasque.Core.BLL.Interfaces
{
    public interface IAwsTaskService
    {
        Task<List<CustomAwsTaskAttributesWithKeys>> GetAllTasks();

        Task<CustomAwsTaskAttributesWithKeys> GetTaskById(int taskId, int projectId);

        Task<CustomAwsTaskAttributesWithKeys> CreateTask(CustomAwsTaskAttributesWithKeys model);

        Task<CustomAwsTaskAttributesWithKeys> UpdateTask(CustomAwsTaskAttributesWithKeys model);

        Task DeleteTask(int taskId, int projectId); 
    }
}
