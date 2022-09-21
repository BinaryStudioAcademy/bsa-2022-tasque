using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Enums;

namespace Tasque.Core.Common.Entities
{
    public class InvitationToken
    {
        [Key]
        public Guid Token { get; set; } = new Guid();
        public int EntityId { get; set; }
        public string? InvitedUserEmail { get; set; }
        public bool IsUserExist { get; set; }
        public DateTime ExpiringAt { get; set; }
        public TokenKind Kind { get; set; }
        public bool IsValid => DateTime.UtcNow < ExpiringAt;
    }
}
