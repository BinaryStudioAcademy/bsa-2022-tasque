using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.DTO.Organization;
using Tasque.Core.Common.DTO.User;
using Tasque.Core.Identity.Services;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrganizationController : EntityController
        <OrganizationCreateDto, OrganizationInfoDto, OrganizationCreateDto, int, OrganizationService>
    {
        private readonly InvitationService _invitationService;
        public OrganizationController(OrganizationService service, InvitationService invitationService)
            : base(service)
        {
            _invitationService = invitationService;
        }

        [Route("getUserOrganizationsById/{id}")]
        [HttpGet]
        public async virtual Task<IActionResult> GetUserOrganizationsById(int id)
        {
            var organizations = await _service.GetUserOrganizations(id);
            if (organizations is not null)
            {
                return Ok(organizations);
            }
            else
            {
                return BadRequest("Entities not found");
            }
        }

        [Route("getOrganizationUsers/{id}")]
        [HttpGet]
        public async virtual Task<IActionResult> GetOrganizationUsers(int id)
        {
            var users = await _service.GetOrganizationUsers(id);
            if (users is not null)
            {
                return Ok(users);
            }
            else
            {
                return NotFound("Users not found");
            }
        }


        [Route("{organizationId}/users/add")]
        [HttpPost]
        public async virtual Task<IActionResult> AddUserToOrganization(int organizationId, [FromBody] UserDto user)
        {
            await _service.AddUser(1, user);

            return Ok();
        }

        [Route("{organizationId}/users/del")]
        [HttpPost]
        public async virtual Task<IActionResult> DeleteUserInOrganization(int organizationId, [FromBody] EmailDto email)
        {
            await _service.DeleteUser(organizationId, email.Email);

            return Ok();
        }

        [HttpPost("invite/{organizationId}")]
        public async Task<IActionResult> InviteUserToOrganization(int organizationId, [FromBody] EmailDto userEmail)
        {
            var isSucced = await _invitationService.InviteUserToOrganization(organizationId, userEmail.Email ?? string.Empty);
            if(!isSucced)
                return BadRequest();
            return Ok();
        }

        [AllowAnonymous]
        [HttpPut("invite/confirm/{key}")]
        public async Task<IActionResult> ConfirmInvitation(Guid key)
        {
            var token = await _invitationService.ConfirmInvitationToken(key);

            if (token == null || token.InvitedUserEmail == null)
                return BadRequest("Expired token");
            return Ok( new EmailDto() { Email = token.InvitedUserEmail });
        }
    }
}
