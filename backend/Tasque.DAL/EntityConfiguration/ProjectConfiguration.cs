using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.DAL.EntityConfiguration
{
    public class ProjectConfiguration : IEntityTypeConfiguration<Project>
    {
        public void Configure(EntityTypeBuilder<Project> builder)
        {
            builder
                .HasOne(project => project.Author)
                .WithMany(user => user.OwnedProjects)
                .HasForeignKey(project => project.AuthorId);

            builder
                .HasMany(project => project.UserRoles)
                .WithOne(userProjectRole => userProjectRole.Project)
                .HasForeignKey(userProjectRole => userProjectRole.ProjectId);
        }
    }
}
