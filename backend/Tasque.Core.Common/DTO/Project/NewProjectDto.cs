namespace Tasque.Core.Common.PartialModels;

public class NewProjectDto
{
    public string? Name { get; set; }
    public string? Key { get; set; }
    public int AuthorId { get; set; }
    public int OrganizationId { get; set; }
}
