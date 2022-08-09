using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.JWT;
using Tasque.Core.BLL.Services;
using Tasque.Core.Common.DTO;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/user")]
    [AllowAnonymous]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private AuthService _service;


        public AuthController(AuthService service, JwtFactory jwtFactory)
        {
            _service = service;
        }

        public async Task<IActionResult> Login([FromBody] UserLoginDto loginInfo)
        {
            return Ok(await _service.Login(loginInfo));
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto registerInfo)
        {
            var registeredUser = await _service.Register(registerInfo);
            var token = _service.GetAccessToken(registeredUser.Id, registeredUser.Name, registeredUser.Email);
            return Ok(token);
        }
    }
}
