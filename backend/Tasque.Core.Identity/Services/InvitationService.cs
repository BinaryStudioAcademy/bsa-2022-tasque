using AutoMapper;
using FluentValidation;
using Microsoft.EntityFrameworkCore;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Enums;
using Tasque.Core.DAL;
using Tasque.Core.Identity.Services.Extensions;
using Task = System.Threading.Tasks.Task;

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
                throw new ValidationException("User is already in organization");

            return await SetUpAndSendInvitationEmail(3, TokenKind.OrganizationInvitation, organizationId, userEmail, user == null ? false : true);
        }

        private async Task<bool> SetUpAndSendInvitationEmail(double lifetimeOfInvitation, TokenKind kind, int entityId, string userEmail, bool isUserExist)
        {
            var lifetime = TimeSpan.FromDays(lifetimeOfInvitation).TotalSeconds;
            var token = await _tokenService.CreateInvitationToken(lifetime, kind, entityId, userEmail, isUserExist);
            return await _tokenService.SendInvitationEmail(token);
        }

        public async Task<InvitationToken> ConfirmInvitationToken(Guid key)
        {
            var token = await _tokenService.ConfirmInvitationToken(key);
            return token;
        }

        public async Task CreateUserModel(int userId, InvitationToken token)
        {
            var userRole = new UserOrganizationRole()
            {
                UserId = userId,
                OrganizationId = token.EntityId,
                Role = UserOrganizationRoles.OrganizationMember,
            };

            _dbContext.UserOrganizationRoles.Add(userRole);
            await _dbContext.SaveChangesAsync();
        }
    }
}
