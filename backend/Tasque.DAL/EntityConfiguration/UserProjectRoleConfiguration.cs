using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.DAL.EntityConfiguration
{
    public class UserProjectRoleConfiguration : IEntityTypeConfiguration<UserProjectRole>
    {
        public void Configure(EntityTypeBuilder<UserProjectRole> builder)
        {
            builder
                .HasNoKey();
        }
    }
}
