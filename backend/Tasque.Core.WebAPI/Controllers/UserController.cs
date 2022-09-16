using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.DTO.User;
using Tasque.Core.Identity.Helpers;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/user")]
    [ApiController]
    [Authorize]
    public class UserController : ControllerBase
    {
        private UserService _service;
        private readonly int _userId;

        public UserController(UserService service, CurrentUserParameters userParams)
        {
            _service = service;
            _userId = userParams.Id;
        }

        [HttpPut("edit")]
        public async Task<IActionResult> EditUserProfile([FromBody] UserDto dto)
        {
            if (dto == null || dto.Id != _userId)
            {
                return BadRequest("Could not save changes");
            }
            var user = await _service.EditUserProfile(dto);
            return Ok(user);
        }

        [HttpPut("edit/avatar")]
        // Max image size 5MB
        // ~150% of original size while converted into Base64
        // And a bit more just in case
        [RequestSizeLimit(10_000_000)]
        public async Task<IActionResult> EditUserAvatar([FromBody] ImageDto img)
        {
            var user = await _service.EditUserAvatar(_userId, img);
            return Ok(user);
        }

        [HttpPut("password")]
        public async Task<IActionResult> EditPassword([FromBody] PasswordEditDto dto)
        {
            if (dto == null || dto.Id != _userId)
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
                    GetUserById(_userId));
        }


        [HttpGet("getUserById/{id}")]
        public async Task<IActionResult> GetUserById(int id)
        {
            return Ok(await _service.
                    GetUserById(id));
        }

        [HttpGet("getUserByEmail/{email}")]
        public async Task<IActionResult> GetUserByEmail(string email)
        {
            return Ok(await _service.
                    GetUserByEmail(email));
        }
    }
}
