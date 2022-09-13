using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.DAL.EntityConfiguration
{
    internal class TaskPriorityConfiguration : IEntityTypeConfiguration<TaskPriority>
    {
        public void Configure(EntityTypeBuilder<TaskPriority> builder)
        {
            builder
                .HasOne(tp => tp.Project)
                .WithMany(p => p.ProjectTaskPriorities)
                .HasForeignKey(tp => tp.ProjectId);
        }
    }
}
