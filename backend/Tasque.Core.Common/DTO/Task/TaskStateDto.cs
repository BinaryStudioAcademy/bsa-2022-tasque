namespace Tasque.Core.Common.DTO.Task;

public class TaskStateDto
{
<<<<<<< HEAD
    public int Id { get; set; }
    public int ProjectId { get; set; }
    public string Name { get; set; } = null!;
    public string? Color { get; set; }
=======
    public class TaskStateDto
    {
        public int Id { get; set; }
        public string Name { get; set; } = null!;
        public string? Color { get; set; }
        public int ProjectId { get; set; }
    }
>>>>>>> 5099a8a217cc1316f9c9ff96e25a368125750e29
}
