using Tasque.Core.Common.DTO.User;

namespace Tasque.Core.Common.DTO.Project
{
    public class ProjectInfoDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string Key { get; set; } = null!;
        public int AuthorId { get; set; }
        public int OrganizationId { get; set; }
        public  List<UserInfoDto>? Users { get; set; }
    }
}
