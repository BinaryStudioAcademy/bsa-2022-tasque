using System.ComponentModel.DataAnnotations;

namespace Tasque.Core.Common.Entities
{
    public class EmailConfirmationToken
    {
        [Key]
        public Guid Token { get; set; } = new Guid();
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public DateTime ExpiringAt { get; set; }
    }
}
