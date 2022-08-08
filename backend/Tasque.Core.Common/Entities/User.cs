using System.ComponentModel.DataAnnotations;
using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class User : BaseEntity
{
    [Required]
    public string Name { get; set; } = "";
    public string Email { get; set; } = "";
    public string Password { get; set; } = "";
    public string Salt { get; set; } = "";
}
