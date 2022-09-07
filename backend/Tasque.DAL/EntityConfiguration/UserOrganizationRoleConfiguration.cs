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
    public class UserOrganizationRoleConfiguration : IEntityTypeConfiguration<UserOrganizationRole>
    {
        public void Configure(EntityTypeBuilder<UserOrganizationRole> builder)
        {
            builder.HasKey(r => new { r.UserId, r.OrganizationId });

            builder
                .HasOne(r => r.User)
                .WithMany(u => u.SystemRoles)
                .HasForeignKey(r => r.UserId);
        }
    }
}
