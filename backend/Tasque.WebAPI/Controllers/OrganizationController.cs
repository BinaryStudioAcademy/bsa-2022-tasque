using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.Common.Entities;
using Tasque.Core.Common.IncomeModels;
//using Tasque.Core.BLL.Services;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class OrganizationController : ControllerBase
    {
        //private readonly EntityCrudService<Organization> _organizationService;

        //public OrganizationController(EntityCrudService<Organization> organizationService)
        //{
        //    _organizationService = organizationService;
        //}

        [HttpPost("createOrganization")]
        public IActionResult CreateOrganization([FromBody] CreateOrganization organization)
        {
            //var entity = _organizationService.Create(organization);
            return Created(organization.ToString()?? "", organization);
        }
    }
}
