using System.ComponentModel.DataAnnotations;
using Tasque.Core.Common.Entities.Abstract;
using Tasque.Core.Common.Enums;

namespace Tasque.Core.Common.Entities
{
    public class ConfirmationToken
    {
        [Key]
        public Guid Token { get; set; } = new Guid();
        public int UserId { get; set; }
        public User User { get; set; } = null!;
        public DateTime ExpiringAt { get; set; }
        public TokenKind Kind{ get; set; }
        public bool IsValid => DateTime.UtcNow < ExpiringAt;
    }
}
