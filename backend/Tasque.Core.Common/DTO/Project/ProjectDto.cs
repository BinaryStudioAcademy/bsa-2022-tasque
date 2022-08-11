namespace Tasque.Core.Common.PartialModels;

public class ProjectDto
{
    public int Id { get; set; }
    public string Name { get; set; } = null!;
    public int AuthorId { get; set; }
    public int OrganizationId { get; set; }
}