using Mailjet.Client;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Tasque.Core.BLL.JWT;
using Tasque.Core.BLL.Services;
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
        private IEmailService _emailService;

        public AuthController(AuthService service, IEmailService emailService)
        {
            _service = service;
            _emailService = emailService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] UserLoginDto loginInfo)
        {
            var user = await _service.Login(loginInfo);
            var token = _service.GetAccessToken(user.Id, user.Name, user.Email);
            return Ok(token);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] UserRegisterDto registerInfo)
        {
            var registeredUser = await _service.Register(registerInfo);
            var token = _service.GetAccessToken(registeredUser.Id, registeredUser.Name, registeredUser.Email);
            await SendConfirmationEmail(registeredUser);
            return Ok(token);
        }

        private async Task SendConfirmationEmail(UserDto user)
        {
            var reciever = new EmailContact(user.Email, user.Name);
            var email = new EmailMessage(reciever)
            {
                Subject = "Successful registration",
                Content = "Thanks for choosing Tasque"
            };
            await _emailService.SendEmailAsync(email);
        }
    }
}
