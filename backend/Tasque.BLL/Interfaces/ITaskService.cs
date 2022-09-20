using Tasque.Core.Common.DTO.Task;

namespace Tasque.Core.BLL.Interfaces
{
    public interface ITaskService
    {
        Task<TaskDto> CreateTask(TaskDto model);

        Task<List<TaskDto>> GetAllProjectTasks(int projectId);

        Task<TaskDto> GetTaskById(int id);

        Task<TaskDto> UpdateTask(TaskDto model);

        Task DeleteTask(int id);

        Task<CommentInfoDTO> AddComment(CreateCommentDTO dto);
        Task<List<CommentInfoDTO>> GetCommentsByTaskId(int taskId);
    }
}
