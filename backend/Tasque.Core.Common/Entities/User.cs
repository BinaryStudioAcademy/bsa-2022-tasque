using System.ComponentModel.DataAnnotations;

namespace Tasque.Core.Common.Entities;

public class User
{
    public int Id { get; set; }
    [Required]
    public string FirstName { get; set; } = "";
    [Required]
    public string LastName { get; set; } = "";
    public string Email { get; set; } = "";
    public DateTime RegisteredAt { get; set; } = DateTime.Now;
    public DateTime BirthDay { get; set; }
}