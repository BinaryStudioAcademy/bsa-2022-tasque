namespace Tasque.Core.Common.DTO.Wiki
{
    public class WikiCreateDto
    {
        public int ProjectId { get; set; }
        public int? ParentPageId { get; set; }
        public string Name { get; set; } = null!;
    }
}
