using System.ComponentModel.DataAnnotations;
using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class Project : BaseEntity
{
    [Required]
    public string Name { get; set; } = "";
    public int AuthorId { get; set; }
    public int OrganizationId { get; set; }
}
