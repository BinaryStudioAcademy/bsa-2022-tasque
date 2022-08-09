using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.Common.DTO;

namespace Tasque.Core.WebAPI.Controllers
{
    [Route("api/user")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        public Task<IActionResult> Login([FromBody] LoginDto loginInfo)
        {
            throw new NotImplementedException();
        }

        public Task<IActionResult> Register([FromBody] RegisterDto registerInfo)
        {
            throw new NotImplementedException();
        }
    }
}
