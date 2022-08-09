using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private AuthService _service;

        public AuthController(AuthService service)
        {
            _service = service;
        }

        public async Task<IActionResult> Login([FromBody] LoginDto loginInfo)
        {
            return Ok(await _service.Login(loginInfo));
        }

        public async Task<IActionResult> Register([FromBody] RegisterDto registerInfo)
        {
            return Ok(await _service.Register(registerInfo));
        }
    }
}
