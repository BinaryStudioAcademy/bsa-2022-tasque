namespace Tasque.Core.Common.DTO.Project;

public class NewProjectDto
{
    public string? Name { get; set; }
    public string? Key { get; set; }
    public int AuthorId { get; set; }
    public int OrganizationId { get; set; }
}
