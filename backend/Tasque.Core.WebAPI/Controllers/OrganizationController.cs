using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.Entities;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrganizationController : EntityController<Organization, OrganizationDto, OrganizationService>
    {
        public OrganizationController(OrganizationService service) : base(service) { }

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

        [HttpPut]
        public async virtual Task<IActionResult> UpdateOrganization([FromBody] OrganizationDto organization)
        {
            var organizations = await _service.EditOrganization(organization);

            if (organizations is not null)
            {
                return Ok();
            }
            else
            {
                return NotFound("Organization not found");
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
        public async virtual Task<IActionResult> DeleteUserInOrganization(int organizationId, [FromBody] UserDto user)
        {
             await _service.DeleteUser(organizationId, user);

            return Ok();
        }
    
    }
}
