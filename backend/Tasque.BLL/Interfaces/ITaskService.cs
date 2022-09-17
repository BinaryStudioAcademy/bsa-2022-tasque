using Tasque.Core.Common.DTO.Task;

namespace Tasque.Core.BLL.Interfaces
{
    public interface ITaskService
    {
        Task<TaskDto> CreateTask(TaskDto model);

        Task<List<TaskDto>> GetAllTasks();

        Task<List<TaskDto>> GetAllProjectTasks(int projectId);

        Task<TaskDto> GetTaskById(int id);

        Task<TaskDto> UpdateTask(TaskDto model);

        Task DeleteTask(int id);
        Task<IEnumerable<TaskDto>> SetOrder(IEnumerable<int> ids);
    }
}
