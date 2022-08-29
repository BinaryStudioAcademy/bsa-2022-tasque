using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.DAL.EntityConfiguration
{
    public class OrganizationConfiguration : IEntityTypeConfiguration<Organization>
    {
        public void Configure(EntityTypeBuilder<Organization> builder)
        {
            builder
               .HasOne(organization => organization.Author)
               .WithMany(user => user.OwnedOrganization)
               .HasForeignKey(organization => organization.AuthorId);
        }

 
    }
}
