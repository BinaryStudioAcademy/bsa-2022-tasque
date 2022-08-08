using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.Entities;
using Task = Tasque.Core.Common.Entities.Task;

namespace Tasque.Core.DAL;

public class DataContext : DbContext
{
    public DataContext()
    {
    }

    public DataContext(DbContextOptions<DataContext> options) : base(options)
    {

    }
    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        modelBuilder.UseSerialColumns();
    }

    public DbSet<Organization>? Organizations { get; set; }
    public DbSet<User>? Users { get; set; }
    public DbSet<Project>? Projects { get; set; }
    public DbSet<Task>? Tasks { get; set; }
    public DbSet<Comment>? Comments { get; set; }
    public DbSet<Attachment>? Attachments { get; set; }
    public DbSet<Board>? Boards { get; set; }
    public DbSet<BoardColumn>? BoardColumns { get; set; }
    public DbSet<Calendar>? Calendars { get; set; }
    public DbSet<Label>? Labels { get; set; }
    public DbSet<Meeting>? Meetings { get; set; }
    public DbSet<Notification>? Notifications { get; set; }
    public DbSet<Role>? Roles { get; set; }
    public DbSet<Sprint>? Sprints { get; set; }
}
