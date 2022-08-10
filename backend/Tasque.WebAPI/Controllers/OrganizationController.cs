using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.PartialModels;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class OrganizationController : ControllerBase
    {

        [HttpPost("createOrganization")]
        public IActionResult CreateOrganization([FromBody] CreateOrganization organization)
        {
            throw new NotImplementedException("Waiting for generic CRUD");
        }
    }
}
