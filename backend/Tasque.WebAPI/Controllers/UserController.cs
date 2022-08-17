using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/user")]
    [AllowAnonymous]  //should be removed
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

        [HttpPut("edit")]
        public async Task<IActionResult> EditUserProfile([FromBody] UserDto dto)
        {
            if(dto == null || dto.Id != GetCurrentUserId())
            {
                return BadRequest("Could not save changes");
            }
            var user = await _service.EditUserProfile(dto);
            return Ok(user);
        }

        private int GetCurrentUserId()
        {
            /* Just a stub. Should be implemented */
            return 1;
        }
    }
}
