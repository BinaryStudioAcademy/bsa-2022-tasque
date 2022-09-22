namespace Tasque.Core.Common.DTO.Wiki
{
    public class WikiInfoDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public List<WikiInfoDto>? NestedPages { get; set; }
    }
}
