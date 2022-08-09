using System.ComponentModel.DataAnnotations;

namespace Tasque.Core.Common.Entities;

public class Project
{
    public int Id { get; set; }
    [Required]
    public string Name { get; set; } = "";
    public string Description { get; set; } = "";
    public int AuthorId { get; set; }
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }
}
