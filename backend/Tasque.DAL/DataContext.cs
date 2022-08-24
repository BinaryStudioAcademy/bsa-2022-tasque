using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.Entities;
using Tasque.Core.DAL.EntityConfiguration;
using Task = Tasque.Core.Common.Entities.Task;

namespace Tasque.Core.DAL;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseSerialColumns();

        modelBuilder.ApplyConfiguration(new UserConfiguration());
        modelBuilder.ApplyConfiguration(new TaskConfiguration());
        modelBuilder.ApplyConfiguration(new ProjectConfiguration());
        modelBuilder.ApplyConfiguration(new OrganizationConfiguration());
        modelBuilder.ApplyConfiguration(new UserProjectRoleConfiguration());
    }

    public DbSet<Organization> Organizations { get; set; } = null!;
    public DbSet<User> Users { get; set; } = null!;
    public DbSet<Project> Projects { get; set; } = null!;
    public DbSet<Task> Tasks { get; set; } = null!;
    public DbSet<Comment> Comments { get; set; } = null!;
    public DbSet<Attachment> Attachments { get; set; } = null!;
    public DbSet<Board> Boards { get; set; } = null!;
    public DbSet<BoardColumn> BoardColumns { get; set; } = null!;
    public DbSet<Calendar> Calendars { get; set; } = null!;
    public DbSet<Label> Labels { get; set; } = null!;
    public DbSet<Meeting> Meetings { get; set; } = null!;
    public DbSet<Notification> Notifications { get; set; } = null!;
    public DbSet<Role> Roles { get; set; } = null!;
    public DbSet<TaskPriority> TaskPriorities { get; set; } = null!;
    public DbSet<TaskState> TaskStates { get; set; } = null!;
    public DbSet<TaskType> TaskTypes { get; set; } = null!;
    public DbSet<UserProjectRole> UserProjectRoles { get; set; } = null!;
    public DbSet<Sprint> Sprints { get; set; } = null!;
    public DbSet<ConfirmationToken> ConfirmationTokens { get; set; } = null!;
}
