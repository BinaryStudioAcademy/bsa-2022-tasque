using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Entities.Abstract;

namespace Tasque.Core.Common.Entities
{
    public class ProjectInvitation
    {
        public int ProjectId { get; set; }
        public Project Project { get; set; }
        public int UserId { get; set; }
        public User User { get; set; }
        public bool IsAccepted { get; set; } = false;
        public bool IsCancelled { get; set; } = false;
    }
}
