using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.DAL.EntityConfiguration
{
    public class UserConfiguration : IEntityTypeConfiguration<User>
    {
        public void Configure(EntityTypeBuilder<User> builder)
        {
            builder
                .HasIndex(u => u.Email)
                .IsUnique();

            builder
                .HasMany(user => user.ParticipatedProjects)
                .WithMany(project => project.Users);

            builder
                .HasMany(user => user.ParticipatedTasks)
                .WithMany(task => task.Users);
        }
    }
}
