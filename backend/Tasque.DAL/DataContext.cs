using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.Entities;

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

    public DbSet<User>? Users { get; set; }
    public DbSet<Project>? Projects { get; set; }
}
