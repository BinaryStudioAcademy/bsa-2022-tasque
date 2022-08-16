using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services.Auth;
using Tasque.Core.Common.DTO;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/user/restore")]
    [ApiController]
    public class RestoreController : ControllerBase
    {
        private PasswordResetService _passwordService;
        public RestoreController(PasswordResetService passwordService)
        {
            _passwordService = passwordService;
        }

        [HttpPost("request")]
        public async Task<IActionResult> RequestPasswordRestore([FromQuery] string email)
        {
            await _passwordService.Request(email);
            return Ok();
        }

        [HttpGet]
        public async Task<IActionResult> ValidatePasswordRestoreToken([FromQuery] Guid token)
        {
            await _passwordService.ValidateToken(token);
            return Ok();
        }

        [HttpPost]
        public async Task<IActionResult> RequestPasswordRestore(PasswordChangeDto body)
        {
            var token = await _passwordService.Confirm(body);
            return Ok(token);
        }
    }
}
