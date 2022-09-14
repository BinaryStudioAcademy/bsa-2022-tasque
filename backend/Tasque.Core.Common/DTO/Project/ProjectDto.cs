using Tasque.Core.Common.DTO.Task;
using Tasque.Core.Common.DTO.User;

namespace Tasque.Core.Common.DTO.Project;

public class ProjectDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public string Key { get; set; } = null!;
    public int AuthorId { get; set; }
    public int OrganizationId { get; set; }

    public List<TaskStateDto> ProjectTaskStates { get; set; } = new();
    public List<TaskPriorityDto> ProjectTaskPriorities { get; set; } = new();
    public List<TaskTypeDto> ProjectTaskTypes { get; set; } = new();
    public List<UserDto> Users { get; set; } = new();
}
