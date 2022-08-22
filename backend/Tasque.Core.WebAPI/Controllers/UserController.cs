using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Exeptions;
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

        [HttpPut("password")]
        public async Task<IActionResult> EditPassword([FromBody] PasswordEditDto dto)
        {
            if (dto == null || dto.Id != GetCurrentUserId())
            {
                return BadRequest("Could not save changes");
            }
            var result = await _service.EditPassword(dto);
            return Ok(result);
        }

        [HttpGet("current")]
        public async Task<IActionResult> GetCurrentUserFromToken()
        {
            return Ok(await _service.
                    GetUserById(
                        GetCurrentUserId()));
        }

        private int GetCurrentUserId()
        {
            var id = User.Claims.FirstOrDefault(x => x.Type == "id")?.Value;
            if (string.IsNullOrEmpty(id))
                throw new InvalidTokenException("Invalid access token");

            return int.Parse(id);
        }
    }
}
