using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.DTO.Task.PartialModels;

namespace Tasque.Core.BLL.Interfaces
{
    public interface ITaskService
    {
        Task<TaskDto> CreateTask(TaskDto model);

        Task<List<TaskDto>> GetAllProjectTasks(int projectId);
        Task<List<TaskDto>> GetAllSprintTasks(int sprintId);

        Task<List<TaskDto>> GetAllBacklogTasks(int projectId);

        Task<TaskDto> GetTaskById(int id);

        Task<List<TaskCustomFields>> GetTaskCustomFieldsById(int id);

        Task<TaskDto> UpdateTask(TaskDto model);

        Task DeleteTask(int id);

        Task<CommentInfoDTO> AddComment(CreateCommentDTO dto);

        Task<List<CommentInfoDTO>> GetCommentsByTaskId(int taskId);

        Task<IEnumerable<TaskDto>> SetOrder(IEnumerable<int> ids);
    }
}
