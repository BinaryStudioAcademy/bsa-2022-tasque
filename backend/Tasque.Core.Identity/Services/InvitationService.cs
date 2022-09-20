﻿using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Newtonsoft.Json.Linq;
using SendGrid.Helpers.Errors.Model;
using Tasque.Core.BLL.Exceptions;
using Tasque.Core.Common.DTO.User;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.Enums;
using Tasque.Core.Common.Models.InvitationModels;
using Tasque.Core.DAL;
using Tasque.Core.Identity.Services.Extensions;
using Task = System.Threading.Tasks.Task;

namespace Tasque.Core.Identity.Services
{
    public class InvitationService
    {
        private readonly ConfirmationTokenExtension _tokenService;
        private readonly DataContext _dbContext;
        private readonly IMapper _mapper;

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

            return await SetUpAndSendInvitationEmail(3, TokenKind.OrganizationInvitation, organizationId, userEmail, user == null ? false : true);
        }

        private async Task<bool> SetUpAndSendInvitationEmail(double lifetimeOfInvitation, TokenKind kind, int entityId, string userEmail, bool isUserExist)
        {
            var lifetime = TimeSpan.FromDays(lifetimeOfInvitation).TotalSeconds;
            var token = await _tokenService.CreateInvitationToken(lifetime, kind, entityId, userEmail, isUserExist);
            return await _tokenService.SendInvitationEmail(token);
        }

        public async Task<ConfirmInvitationModel> ConfirmInvitation(Guid key)
        {
            var token = await _tokenService.ConfirmInvitation(key);
            var user = _dbContext.Users.FirstOrDefaultAsync(u => u.Email == token.InvitedUserEmail);

            if (user == null)
                throw new CustomNotFoundException("User");

            if (token.Kind == TokenKind.OrganizationInvitation)
                await CreateUserModel(user.Id, token);

            return new()
            {
                InvitationToken = token,
                User = _mapper.Map<UserDto>(user),
            };
        }

        private async Task CreateUserModel(int userId, InvitationToken token)
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
