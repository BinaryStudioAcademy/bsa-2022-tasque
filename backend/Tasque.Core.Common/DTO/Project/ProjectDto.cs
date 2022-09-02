namespace Tasque.Core.Common.DTO.Project;

public class ProjectDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int AuthorId { get; set; }
    public int OrganizationId { get; set; }
}
