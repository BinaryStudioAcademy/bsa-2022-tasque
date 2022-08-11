using Tasque.Core.Identity.Services.Abstraction;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.Common.Entities;
using Microsoft.AspNetCore.Authorization;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/[controller]")]
    //[Authorize]
    [ApiController]
    public class UsersController : EntityController<User, User, IUserService>
    {
        public UsersController(IUserService service) : base(service) { }

        [HttpGet]
        [Route("getByEmail/{email}")]
        public IActionResult GetByEmail(string email)
        {
            var user = _service.GetByEmail(email);

            if (user is null)
            {
                return BadRequest();
            }

            return Ok(user);
        }
    }
}
