namespace Tasque.Core.Common.DTO.Wiki
{
    public class WikiInfoDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Text { get; set; }
        public int ProjectId { get; set; }
        public int? ParentPageId { get; set; }
        public List<WikiInfoDto>? NestedPages { get; set; }
    }
}
