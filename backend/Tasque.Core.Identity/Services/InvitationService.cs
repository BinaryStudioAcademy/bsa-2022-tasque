using Microsoft.EntityFrameworkCore;
using SendGrid.Helpers.Errors.Model;
using Tasque.Core.Common.Enums;
using Tasque.Core.DAL;
using Tasque.Core.Identity.Services.Extensions;

namespace Tasque.Core.Identity.Services
{
    public class InvitationService
    {
        private readonly ConfirmationTokenExtension _tokenService;
        private readonly DataContext _dbContext;

        public InvitationService(
            ConfirmationTokenExtension tokenService,
            DataContext dbContext)
        {
            _tokenService = tokenService;
            _dbContext = dbContext;
        }

        public async Task<bool> InviteUserToOrganization(int organizationId, string userEmail)
        {
            var user = await _dbContext.Users.Where(u => u.Email == userEmail)
                .Include(u => u.SystemRoles)
                .FirstOrDefaultAsync();

            if (user != null && user.SystemRoles.Any(r => r.OrganizationId == organizationId))
                throw new BadRequestException("User is already in organization");

            return await SetUpAndSendInvitationEmail(3, TokenKind.OrganizationInvitation, organizationId, userEmail);
        }

        private async Task<bool> SetUpAndSendInvitationEmail(double lifetimeOfInvitation, TokenKind kind, int entityId, string userEmail)
        {
            var lifetime = TimeSpan.FromDays(lifetimeOfInvitation).TotalSeconds;
            var token = await _tokenService.CreateInvitationToken(lifetime, kind, entityId, userEmail);
            return await _tokenService.SendInvitationEmail(token);
        }
    }
}
