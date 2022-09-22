namespace Tasque.Core.Common.DTO.Wiki
{
    public class WikiPageDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Text { get; set; }
        public string? Title { get; set; }
    }
}
