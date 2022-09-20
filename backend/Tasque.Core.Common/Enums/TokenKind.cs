using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Tasque.Core.Common.Enums
{
    public enum TokenKind
    {
        EmailConfirmation = 1,
        PasswordReset = 2,
        ReferralSignUp = 3,
        OrganizationInvitation,
    }
}
