using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Enums;

namespace Tasque.Core.DAL.SeedData
{
    public static class SeedData
    {
        public static void Seed(this ModelBuilder builder)
        {
            SeedProjectRole(builder);
        }

        public static void SeedProjectRole(ModelBuilder builder) =>
            builder.Entity<Role>().HasData
                (
                    new Role()
                    {
                        Id = (int)BaseProjectRole.Admin,
                        Name = BaseProjectRole.Admin.ToString(),
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Role()
                    {
                        Id = (int)BaseProjectRole.Dev,
                        Name = BaseProjectRole.Dev.ToString(),
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    },
                    new Role()
                    {
                        Id = (int)BaseProjectRole.QA,
                        Name = BaseProjectRole.QA.ToString(),
                        CreatedAt = DateTime.UtcNow,
                        UpdatedAt = DateTime.UtcNow
                    }
                );
    }
}
