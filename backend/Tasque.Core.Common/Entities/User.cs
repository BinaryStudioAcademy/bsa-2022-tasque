using FluentValidation;
using System.Text.RegularExpressions;
using Tasque.Core.Common.Entities.Abstract;
using Tasque.Core.Common.Security;

namespace Tasque.Core.Common.Entities;

public class User : BaseEntity, IBaseEntity
{
    public User()
    {
        Meetings = new List<Meeting>();
        OwnedProjects = new List<Project>();
        ParticipatedProjects = new List<Project>();
        OwnedTasks = new List<Task>();
        ParticipatedTasks = new List<Task>();
        Roles = new List<UserProjectRole>();
        OwnedOrganization = new List<Organization>();
        ParticipatedOrganization = new List<Organization>();
    }
    public string Name { get; set; } = null!;
    public string Email { get; set; } = null!;
    public string Password { get; set; } = null!;
    public string Salt { get; set; } = null!;
    public bool IsEmailConfirmed { get; set; } = false;
    public string? AvatarURL { get; set; }

    public virtual ICollection<Meeting> Meetings { get; set; }
    public virtual ICollection<Project> OwnedProjects { get; set; }
    public virtual ICollection<Project> ParticipatedProjects { get; set; }
    public virtual ICollection<Task> OwnedTasks { get; set; }
    public virtual ICollection<Task> ParticipatedTasks { get; set; }
    public virtual ICollection<UserProjectRole> Roles { get; set; }
    public virtual ICollection<UserOrganizationRole> SystemRoles { get; set; }
    public virtual ICollection<Organization> ParticipatedOrganization { get; set; }
    public virtual ICollection<Organization> OwnedOrganization { get; set; }
}

public class UserValidator : AbstractValidator<User>
{
    public UserValidator()
    {
        // Not using built-in email validation because it's not working properly
        // example@example -> valid email
        RuleFor(x => x.Email)
            .NotEmpty().WithMessage("Email is required")
            .Matches(Constants.EMAIL_REGEX).WithMessage("Email address is not valid");
        RuleFor(x => x.Password).MinimumLength(8).WithMessage("Password must be at least 8 characters");
            
        RuleFor(x => x.Name)
            .MinimumLength(2).WithMessage("Username must be at least 2 characters")
            .MaximumLength(30).WithMessage("Username must not exceed 30 characters");
    }
}
