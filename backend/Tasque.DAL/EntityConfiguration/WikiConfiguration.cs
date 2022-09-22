using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.DAL.EntityConfiguration
{
    public class WikiConfiguration : IEntityTypeConfiguration<WikiPage>
    {
        public void Configure(EntityTypeBuilder<WikiPage> builder)
        {
            builder
                .HasOne(x => x.ParentPage)
                .WithMany(x => x.NestedPages)
                .HasForeignKey(x => x.ParentPageId);
        }
    }
}
