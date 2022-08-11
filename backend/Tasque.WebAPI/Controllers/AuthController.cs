using Mailjet.Client;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.JWT;
using Tasque.Core.BLL.Services.Auth;
using Tasque.Core.BLL.Services.Email;
using Tasque.Core.Common.DTO;
using Tasque.Core.Common.Models.Email;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/user")]
    [AllowAnonymous]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private AuthService _service;
        private PasswordResetService _passwordService;
        private IEmailService _emailService;

        public AuthController(AuthService service, PasswordResetService passwordService, IEmailService emailService)
        {
            _service = service;
            _passwordService = passwordService;
            _emailService = emailService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto loginInfo)
        {
            var user = await _service.Login(loginInfo);
            return Login(user);
        }

        [HttpGet("confirm")]
        public async Task<IActionResult> ConfirmEmail([FromQuery] Guid key)
        {
            var user = await _service.Login(key);
            return Login(user);
        }

        private IActionResult Login(UserDto user)
        {
            var token = _service.GetAccessToken(user.Id, user.Name, user.Email);
            return Ok(token);
        }
        
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto registerInfo)
        {
            await _service.Register(registerInfo);
            return Ok();
        }

        [HttpPost("restore")]
        public async Task<IActionResult> RequestPasswordRestore([FromQuery] string email)
        {
            await _passwordService.Request(email);
            return Ok();
        }

        [HttpPost("restore")]
        public async Task<IActionResult> RequestPasswordRestore([FromQuery] Guid key)
        {
            string token = await _passwordService.Confirm(key);
            return Ok(token);
        }
    }
}
