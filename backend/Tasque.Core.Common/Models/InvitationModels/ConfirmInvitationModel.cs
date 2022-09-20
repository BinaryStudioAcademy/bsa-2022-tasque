using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.DTO.User;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.Common.Models.InvitationModels
{
    public class ConfirmInvitationModel
    {
        public InvitationToken? InvitationToken { get; set; }
        public UserDto? User { get; set; }
    }
}
