using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Models.Email;

namespace Tasque.Core.Identity.Services.Extensions.Factory.Builders
{
    public interface IEmailBuilder
    {
        Task<EmailMessage> GetEmailMessage(InvitationToken token);
    }
}
