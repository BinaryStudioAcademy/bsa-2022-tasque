using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services.Auth;
using Tasque.Core.Common.DTO;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/user")]
    [AllowAnonymous]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private AuthService _service;        

        public AuthController(AuthService service)
        {
            _service = service;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto loginInfo)
        {
            var user = await _service.Login(loginInfo);
            return Login(user);
        }

        [HttpPost("test")]
        public async Task<IActionResult> Test([FromForm] CredentilasDTO form)
        {
            Console.WriteLine(form);
            return Ok(form);
        }

        [HttpGet("confirm")]
        public async Task<IActionResult> ConfirmEmail([FromQuery] Guid key)
        {
            var user = await _service.Login(key);
            return Login(user);
        }

        [HttpPost("confirm")]
        public async Task<IActionResult> RequestEmailConfirmation([FromBody] EmailDto dto)
        {
            await _service.RequestEmailConfirmation(dto.Email);
            return Ok();
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
    }
}
