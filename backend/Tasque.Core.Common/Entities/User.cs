using FluentValidation;
using System.Text.RegularExpressions;
using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities;

public class User : BaseEntity
{
    public User()
    {
        Tasks = new List<Task>();
        Meetings = new List<Meeting>();
        Projects = new List<Project>();
        Roles = new List<Role>();
    }
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Salt { get; set; } = null!;

    public virtual ICollection<Task> Tasks { get; set; }
    public virtual ICollection<Meeting> Meetings { get; set; }
    public virtual ICollection<Project> Projects { get; set; }
    public virtual ICollection<Role> Roles { get; set; }
}

public class UserValidator : AbstractValidator<User>
{
    private static readonly Regex EMAIL_REGEX = new(@"^[\w-\.]+@([\w-]+\.)+[\w-]{2,3}$");
    public UserValidator()
    {
        // Not using built-in email validation because it's not working properly
        // example@example -> valid email
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .Matches(EMAIL_REGEX).WithMessage("Email adress is not valid");
        RuleFor(x => x.Password).MinimumLength(8).WithMessage("Password must be at least 8 characters");
    }
}
