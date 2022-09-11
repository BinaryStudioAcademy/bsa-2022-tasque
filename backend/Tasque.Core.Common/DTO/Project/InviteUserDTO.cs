using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.DTO.Project
{
    public class InviteUserDTO
    {
        public int ProjectId { get; set; }
        public string InviteeEmail { get; set; }
        public string InvitorEmail { get; set; }
    }
}
