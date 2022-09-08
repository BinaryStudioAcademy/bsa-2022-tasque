using Tasque.Core.Common.Entities;

namespace Tasque.Core.Common.DTO.Project
{
    public class ProjectAfterCreateDto
    {
        public string Name { get; set; } = null!;
        public string Key { get; set; } = null!;
        public int AuthorId { get; set; }
        public int OrganizationId { get; set; }
    }
}
