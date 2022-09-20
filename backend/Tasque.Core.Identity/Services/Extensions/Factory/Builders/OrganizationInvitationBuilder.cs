using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Tasque.Core.BLL.Exceptions;
using Tasque.Core.BLL.Options;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Models.Email;
using Tasque.Core.DAL;

namespace Tasque.Core.Identity.Services.Extensions.Factory.Builders
{
    public class OrganizationInvitationBuilder : IEmailBuilder
    {
        private protected DataContext _context;
        private protected EmailConfirmationOptions _emailOptions;
        private protected IConfiguration _configuration;

        public OrganizationInvitationBuilder(
            DataContext context,
            EmailConfirmationOptions emailOptions,
            IConfiguration configuration)
        {
            _context = context;
            _emailOptions = emailOptions;
            _configuration = configuration;
        }

        public async Task<EmailMessage> GetEmailMessage(InvitationToken token)
        {
            var reciever = new EmailContact(token.InvitedUserEmail ?? string.Empty, token.InvitedUserEmail ?? string.Empty);
            var host = _emailOptions.Host;
            var endpoint = token.IsUserExist ? _emailOptions.InviteExistUserEndpoint : _emailOptions.InviteNewUserEndpoint;
            var link = $"{host}{endpoint}";
            var key = token.Token;
            var logo = _configuration["Host:BigLogo"];
            var organization = await _context.Organizations.FirstOrDefaultAsync(o => o.Id == token.EntityId);

            if (organization == null)
                throw new CustomNotFoundException("organization");

            Dictionary<string, string> args = new()
            {
                { "appLink", host },
                { "logoLink", logo },
                { "email", token.InvitedUserEmail ?? string.Empty },
                { "link", $"{link}?key={key}" },
                { "organizationName", organization.Name }
            };

            string html = await AssemblyResourceService.GetResource(AssemblyResource.InviteToOrganizationMessage);
            foreach (var kv in args)
                html = html.Replace($"{{{kv.Key}}}", kv.Value);

            return new EmailMessage(reciever)
            {
                Subject = "Invitation to organization",
                Content = html,
                Sender = new EmailContact(_emailOptions.SenderEmail, _emailOptions.SenderName)
            };
        }
    }
}
