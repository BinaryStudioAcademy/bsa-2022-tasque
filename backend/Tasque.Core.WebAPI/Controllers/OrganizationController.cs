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
        public virtual IActionResult GetUserOrganizationsById(int userId)
        {
            var organizations = _service.GetUserOrganizations(userId);
            if (organizations is not null)
            {
                return Ok(organizations);
            }
            else
            {
                return BadRequest("Entities not found");
            }
        }
    }
}
