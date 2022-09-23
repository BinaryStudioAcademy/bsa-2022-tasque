namespace Tasque.Core.Common.DTO.Project;

public class NewProjectDto
{
    public string Name { get; set; } = null!;
    public string Key { get; set; } = null!;
    public int OrganizationId { get; set; }
    public int AuthorId { get; set; }
}
