using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/user")]
    [AllowAnonymous]
    [ApiController]
    public class UserController : ControllerBase
    {
        private UserService _service;

        public UserController(UserService service)
        {
            _service = service;
        }

        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentUser()
        {
            var id = GetCurrentUserId();
            var user = await _service.GetUserById(id);
            return Ok(user);
        }

        private int GetCurrentUserId()
        {
            return 1;
        }
    }
}
