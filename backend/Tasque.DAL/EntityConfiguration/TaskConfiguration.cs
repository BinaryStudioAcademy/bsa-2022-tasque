using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.Entities;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Task = Tasque.Core.Common.Entities.Task;

namespace Tasque.Core.DAL.EntityConfiguration
{
    public class TaskConfiguration : IEntityTypeConfiguration<Task>
    {
        public void Configure(EntityTypeBuilder<Task> builder)
        {
            builder
                .HasOne(task => task.Author)
                .WithMany(user => user.OwnedTasks)
                .HasForeignKey(task => task.AuthorId);

            builder
                .HasOne(task => task.LastUpdatedBy);
        }
    }
}
