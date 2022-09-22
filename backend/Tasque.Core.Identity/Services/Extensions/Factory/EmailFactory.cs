using Microsoft.Extensions.Configuration;
using Tasque.Core.BLL.Options;
using Tasque.Core.Common.Enums;
using Tasque.Core.DAL;
using Tasque.Core.Identity.Exceptions;
using Tasque.Core.Identity.Services.Extensions.Factory.Builders;

namespace Tasque.Core.Identity.Services.Extensions.Factory
{
    public sealed class EmailFactory
    {
        private readonly DataContext _context;
        private readonly EmailConfirmationOptions _emailOptions;
        private readonly IConfiguration _configuration;

        public EmailFactory(
            DataContext context,
            EmailConfirmationOptions emailOptions,
            IConfiguration configuration)
        {
            _context = context;
            _emailOptions = emailOptions;
            _configuration = configuration;
        }

        public IEmailBuilder GetEmailBuilder(TokenKind kind)
        {
            return kind switch
            {
                TokenKind.OrganizationInvitation => new OrganizationInvitationBuilder(_context, _emailOptions, _configuration),
                _ => throw new InvalidTokenKindException(),
            };
        }
    }
}
