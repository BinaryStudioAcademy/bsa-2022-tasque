using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.Entities;
using Task = Tasque.Core.Common.Entities.Task;

namespace Tasque.Core.DAL;

public class DataContext : DbContext
{
    public DataContext(DbContextOptions<DataContext> options) : base(options) { }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseSerialColumns();

        modelBuilder.Entity<Project>()
            .HasOne(project => project.Author)
            .WithMany(user => user.OwnedProjects)
            .HasForeignKey(project => project.AuthorId);

        modelBuilder.Entity<Task>()
            .HasOne(task => task.Author)
            .WithMany(user => user.OwnedTasks)
            .HasForeignKey(task => task.AuthorId);

        modelBuilder.Entity<User>()
            .HasMany(user => user.ParticipatedProjects)
            .WithMany(project => project.Users);

        modelBuilder.Entity<User>()
            .HasMany(user => user.ParticipatedTasks)
            .WithMany(task => task.Users);

        modelBuilder.Entity<Task>()
            .HasOne(task => task.LastUpdatedBy);
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
    public DbSet<Sprint> Sprints { get; set; } = null!;
    public DbSet<EmailConfirmationToken> EmailConfirmationTokens { get; set; } = null!;
}
