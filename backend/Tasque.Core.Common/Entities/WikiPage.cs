using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities
{
    public class WikiPage : BaseEntity
    {
        public string Name { get; set; } = null!;
        public string? Text { get; set; }
        public WikiPage? ParentPage { get; set; }
        public int? ParentPageId { get; set; }
        public Project Project { get; set; } = null!;
        public int ProjectId { get; set; }

        public List<WikiPage>? NestedPages { get; set; }
    }
}
